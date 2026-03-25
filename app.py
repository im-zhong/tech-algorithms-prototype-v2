"""
深圳市低空经济产业分析平台 - Flask主应用
"""
import os
import pandas as pd
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from config import DATA_DIR, DATASET_FILES, SECRET_KEY

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app)


def load_csv(filename):
    """加载CSV数据"""
    filepath = os.path.join(DATA_DIR, filename)
    if os.path.exists(filepath):
        df = pd.read_csv(filepath)
        return df.to_dict(orient='records')
    return []


# ============== 页面路由 ==============

@app.route('/')
def index():
    """主页"""
    return render_template('index.html')


# ============== API接口 ==============

@app.route('/api/data/overview')
def get_overview():
    """获取数据概览统计"""
    scale_data = load_csv(DATASET_FILES['scale'])
    innovation_data = load_csv(DATASET_FILES['innovation'])
    capital_data = load_csv(DATASET_FILES['capital'])

    if scale_data and innovation_data and capital_data:
        latest_scale = scale_data[-1]  # 最新年份数据
        latest_innovation = innovation_data[-1]
        latest_capital = capital_data[-1]

        # 计算增长率
        prev_scale = scale_data[-2] if len(scale_data) > 1 else scale_data[-1]

        overview = {
            'key_metrics': {
                'enterprise_count': latest_scale.get('企业数量', 0),
                'enterprise_growth': round((latest_scale.get('企业数量', 0) - prev_scale.get('企业数量', 0)) / prev_scale.get('企业数量', 1) * 100, 1) if prev_scale.get('企业数量', 0) > 0 else 0,
                'revenue': latest_scale.get('产业营收_亿元', 0),
                'revenue_growth': round((latest_scale.get('产业营收_亿元', 0) - prev_scale.get('产业营收_亿元', 0)) / prev_scale.get('产业营收_亿元', 1) * 100, 1) if prev_scale.get('产业营收_亿元', 0) > 0 else 0,
                'patent_count': latest_innovation.get('发明专利数量', 0),
                'financing_amount': latest_capital.get('融资金额_亿元', 0),
                'employment': latest_scale.get('从业人数', 0)
            },
            'years': [d.get('年份') for d in scale_data],
            'scale_trend': {
                'enterprise': [d.get('企业数量') for d in scale_data],
                'revenue': [d.get('产业营收_亿元') for d in scale_data]
            }
        }
        return jsonify({'success': True, 'data': overview})

    return jsonify({'success': False, 'message': '数据加载失败'})


@app.route('/api/data/scale')
def get_scale():
    """获取产业规模数据"""
    data = load_csv(DATASET_FILES['scale'])
    if data:
        return jsonify({'success': True, 'data': data})
    return jsonify({'success': False, 'message': '数据加载失败'})


@app.route('/api/data/innovation')
def get_innovation():
    """获取创新数据"""
    data = load_csv(DATASET_FILES['innovation'])
    if data:
        return jsonify({'success': True, 'data': data})
    return jsonify({'success': False, 'message': '数据加载失败'})


@app.route('/api/data/capital')
def get_capital():
    """获取资本热度数据"""
    data = load_csv(DATASET_FILES['capital'])
    if data:
        return jsonify({'success': True, 'data': data})
    return jsonify({'success': False, 'message': '数据加载失败'})


@app.route('/api/data/ecosystem')
def get_ecosystem():
    """获取产业生态数据"""
    data = load_csv(DATASET_FILES['ecosystem'])
    if data:
        return jsonify({'success': True, 'data': data})
    return jsonify({'success': False, 'message': '数据加载失败'})


@app.route('/api/data/policy')
def get_policy():
    """获取政策环境数据"""
    data = load_csv(DATASET_FILES['policy'])
    if data:
        return jsonify({'success': True, 'data': data})
    return jsonify({'success': False, 'message': '数据加载失败'})


@app.route('/api/data/enterprise')
def get_enterprise():
    """获取企业竞争数据"""
    data = load_csv(DATASET_FILES['enterprise'])
    if data:
        return jsonify({'success': True, 'data': data})
    return jsonify({'success': False, 'message': '数据加载失败'})


@app.route('/api/data/indicators')
def get_indicators():
    """获取指标体系结构"""
    data = load_csv(DATASET_FILES['indicators'])
    if data:
        # 构建树形结构
        indicator_tree = {}
        for item in data:
            level1 = item.get('一级指标', '')
            level2 = item.get('二级指标', '')
            if level1 not in indicator_tree:
                indicator_tree[level1] = {
                    'name': level1,
                    'children': [],
                    'source': item.get('数据来源文件', ''),
                    'weight': 20  # 默认权重
                }
            indicator_tree[level1]['children'].append({
                'name': level2,
                'field': item.get('核心字段', ''),
                'purpose': item.get('用途', ''),
                'source': item.get('数据来源文件', '')
            })

        return jsonify({
            'success': True,
            'data': list(indicator_tree.values())
        })
    return jsonify({'success': False, 'message': '数据加载失败'})


@app.route('/api/data/all')
def get_all_data():
    """获取所有数据（用于AI分析）"""
    return jsonify({
        'success': True,
        'data': {
            'scale': load_csv(DATASET_FILES['scale']),
            'innovation': load_csv(DATASET_FILES['innovation']),
            'enterprise': load_csv(DATASET_FILES['enterprise']),
            'capital': load_csv(DATASET_FILES['capital']),
            'ecosystem': load_csv(DATASET_FILES['ecosystem']),
            'policy': load_csv(DATASET_FILES['policy'])
        }
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
