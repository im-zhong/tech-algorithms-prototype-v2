"""
配置文件
"""

# Flask配置
SECRET_KEY = 'low-altitude-economy-analysis-2025'

# 数据文件路径
DATA_DIR = 'data'

# 数据集文件映射
DATASET_FILES = {
    'scale': '01_产业规模年度数据集_低空经济_深圳市_2021_2025.csv',
    'innovation': '02_产业创新年度数据集_低空经济_深圳市_2021_2025.csv',
    'enterprise': '03_企业竞争分析数据集_低空经济_深圳市_2025样例.csv',
    'capital': '04_资本热度年度数据集_低空经济_深圳市_2021_2025.csv',
    'ecosystem': '05_产业生态年度数据集_低空经济_深圳市_2021_2025.csv',
    'policy': '06_政策环境年度数据集_低空经济_深圳市_2021_2025.csv',
    'indicators': '07_指标体系映射说明.csv',
    'manifest': '00_文件清单.csv'
}
