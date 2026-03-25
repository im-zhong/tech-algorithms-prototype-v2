/**
 * 深圳市低空经济产业分析平台
 * Mock data imported from mock-data.js and mock-ai.js
 */

// Import mock data and AI responses
// These are defined in separate files that must be loaded before this script

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            activeMenu: 'dashboard',

            // 数据 - loaded from mock-data.js (global variables)
            scaleData: window.scaleData || [],
            innovationData: window.innovationData || [],
            enterpriseData: window.enterpriseData || [],
            capitalData: window.capitalData || [],
            ecosystemData: window.ecosystemData || [],
            policyData: window.policyData || [],

            // 年份选择
            selectedYear: 2025,
            availableYears: [2021, 2022, 2023, 2024, 2025],

            // 分析状态
            analyzing: false,
            analyzingCompetition: false,
            predicting: false,
            marketAnalysis: '',
            competitionAnalysis: '',
            predictionResult: '',

            // 预测设置
            predictionField: 'enterprise',
            predictedValues: null, // AI返回的预测值
            hasPredicted: false, // 是否已完成预测

            // 菜单
            menuItems: [
                { id: 'dashboard', name: '数据概览', icon: '📊' },
                { id: 'indicators', name: '指标体系', icon: '🎯' },
                { id: 'market', name: '市场分析', icon: '📈' },
                { id: 'competition', name: '竞争格局', icon: '🏆' },
                { id: 'prediction', name: '趋势预测', icon: '🔮' }
            ],

            // 指标分组结构
            indicatorGroups: [
                { name: '产业规模发展', icon: '📊', bgColor: 'bg-blue', color: 'text-blue', dataSource: 'scale', items: [
                    { name: '企业数量', field: '企业数量', unit: '家' },
                    { name: '产业营收规模', field: '产业营收_亿元', unit: '亿元' },
                    { name: '产业增加值', field: '产业增加值_亿元', unit: '亿元' },
                    { name: '从业人数', field: '从业人数', unit: '人' }
                ]},
                { name: '产业创新能力', icon: '💡', bgColor: 'bg-green', color: 'text-green', dataSource: 'innovation', items: [
                    { name: '发明专利数量', field: '发明专利数量', unit: '件' },
                    { name: '高价值专利数量', field: '高价值专利数量', unit: '件' },
                    { name: '论文数量', field: '论文数量', unit: '篇' },
                    { name: '研发投入强度', field: '研发投入_亿元', unit: '亿元' }
                ]},
                { name: '市场活跃程度', icon: '🔥', bgColor: 'bg-orange', color: 'text-orange', dataSource: 'capital', items: [
                    { name: '融资事件数量', field: '融资事件数量', unit: '次' },
                    { name: '融资金额', field: '融资金额_亿元', unit: '亿元' },
                    { name: '新设企业数量', field: '新设企业数量', unit: '家', dataSource: 'scale' }
                ]},
                { name: '产业发展环境', icon: '🏛️', bgColor: 'bg-purple', color: 'text-purple', dataSource: 'ecosystem', items: [
                    { name: '政策支持强度', field: '政策支持资金_亿元', unit: '亿元', dataSource: 'policy' },
                    { name: '科研机构支撑度', field: '科研机构数量', unit: '个' },
                    { name: '人才集聚度', field: '重点人才数量', unit: '人' }
                ]},
                { name: '资本热度指数', icon: '💵', bgColor: 'bg-pink', color: 'text-purple', dataSource: 'capital', items: [
                    { name: '天使轮数量', field: '天使轮数量', unit: '次' },
                    { name: 'A轮及以上数量', field: 'A轮数量', unit: '次' },
                    { name: '上市企业数量', field: '上市企业数量', unit: '家' }
                ]}
            ]
        };
    },

    computed: {
        currentTitle() {
            const item = this.menuItems.find(m => m.id === this.activeMenu);
            return item ? item.name : '';
        },
        currentSubtitle() {
            const titles = {
                dashboard: '深圳市低空经济核心数据一览',
                indicators: '产业指标体系架构与数据展示',
                market: '产业规模与市场发展态势分析',
                competition: '重点企业竞争力与市场格局分析',
                prediction: '基于历史数据的产业发展预测'
            };
            return titles[this.activeMenu] || '';
        },
        metricCards() {
                const latest = this.scaleData[this.scaleData.length - 1] || {};
                const prev = this.scaleData[this.scaleData.length - 2] || {};
                const innovation = this.innovationData[this.innovationData.length - 1] || {};
                const capital = this.capitalData[this.capitalData.length - 1] || {};

                const calcGrowth = (curr, prevVal) => {
                    if (!curr || !prevVal) return 0;
                    return Math.round((curr - prevVal) / prevVal * 1000) / 10;
                };

                return [
                    {
                        label: '企业数量',
                        value: latest['企业数量'] || 0,
                        unit: '家',
                        icon: '🏢',
                        color: 'text-blue',
                        bgColor: 'bg-blue',
                        growth: calcGrowth(latest['企业数量'], prev['企业数量'])
                    },
                    {
                        label: '产业营收',
                        value: latest['产业营收_亿元'] || 0,
                        unit: '亿元',
                        icon: '💰',
                        color: 'text-green',
                        bgColor: 'bg-green',
                        growth: calcGrowth(latest['产业营收_亿元'], prev['产业营收_亿元'])
                    },
                    {
                        label: '发明专利',
                        value: innovation['发明专利数量'] || 0,
                        unit: '件',
                        icon: '📜',
                        color: 'text-orange',
                        bgColor: 'bg-orange',
                        growth: 0
                    },
                    {
                        label: '融资金额',
                        value: capital['融资金额_亿元'] || 0,
                        unit: '亿元',
                        icon: '📈',
                        color: 'text-purple',
                        bgColor: 'bg-purple',
                        growth: 0
                    }
                ];
            },
        indicatorGroupsWithData() {
                const scaleYearData = this.scaleData.find(d => d['年份'] === this.selectedYear) || {};
                const innovationYearData = this.innovationData.find(d => d['年份'] === this.selectedYear) || {};
                const capitalYearData = this.capitalData.find(d => d['年份'] === this.selectedYear) || {};
                const ecosystemYearData = this.ecosystemData.find(d => d['年份'] === this.selectedYear) || {};
                const policyYearData = this.policyData.find(d => d['年份'] === this.selectedYear) || {};

                return this.indicatorGroups.map(group => {
                    const itemsWithData = group.items.map(item => {
                        let data = {};
                        if (item.dataSource === 'scale' || group.dataSource === 'scale') {
                            data = scaleYearData;
                        } else if (item.dataSource === 'innovation' || group.dataSource === 'innovation') {
                            data = innovationYearData;
                        } else if (item.dataSource === 'capital' || group.dataSource === 'capital') {
                            data = capitalYearData;
                        } else if (item.dataSource === 'ecosystem' || group.dataSource === 'ecosystem') {
                            data = ecosystemYearData;
                        } else if (item.dataSource === 'policy' || group.dataSource === 'policy') {
                            data = policyYearData;
                        }

                        const rawValue = data[item.field];
                        let displayValue = '-';

                        if (rawValue !== undefined && rawValue !== null) {
                            if (item.field === '从业人数') {
                                displayValue = rawValue.toLocaleString() + ' ' + item.unit;
                            } else {
                                displayValue = rawValue + ' ' + item.unit;
                            }
                        }

                        return { name: item.name, value: displayValue };
                    });

                    return { ...group, items: itemsWithData };
                });
            }
        },

    methods: {
            formatNumber(num) {
                if (!num) return '-';
                return num.toLocaleString();
            },

            safeInitChart(elementId) {
                const el = document.getElementById(elementId);
                if (!el) return null;

                const existingChart = echarts.getInstanceByDom(el);
                if (existingChart) existingChart.dispose();

                const parent = el.closest('[style*="display: none"]');
                if (parent) return null;

                const chart = echarts.init(el);
                setTimeout(() => { try { chart.resize(); } catch (e) {} }, 100);
                return chart;
            },

            async loadData() {
                console.log('开始加载mock数据...');

                // Mock data is already embedded from mock-data.js
                // Just simulate loading delay for realistic UX
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                // Simulate loading with delays
                await delay(300);
                console.log('scaleData 加载成功:', this.scaleData.length, '条');

                await delay(200);
                console.log('innovationData 加载成功:', this.innovationData.length, '条');

                await delay(200);
                console.log('enterpriseData 加载成功:', this.enterpriseData.length, '条');

                await delay(200);
                console.log('capitalData 加载成功:', this.capitalData.length, '条');

                await delay(200);
                console.log('ecosystemData 加载成功:', this.ecosystemData.length, '条');

                await delay(200);
                console.log('policyData 加载成功:', this.policyData.length, '条');

                console.log('Mock数据加载完成');
                this.$nextTick(() => this.renderDashboardCharts());
            },

            renderCharts() {
                if (this.activeMenu === 'dashboard') {
                    this.renderDashboardCharts();
                } else if (this.activeMenu === 'market') {
                    this.renderMarketCharts();
                } else if (this.activeMenu === 'competition') {
                    this.renderCompetitionCharts();
                } else if (this.activeMenu === 'prediction') {
                    this.renderPredictionCharts();
                }
            },

            renderDashboardCharts() {
                if (this.scaleData.length === 0) return;

                const chart1 = this.safeInitChart('chart-enterprise');
                if (!chart1) return;

                const years = this.scaleData.map(d => d['年份']);
                const enterprises = this.scaleData.map(d => d['企业数量']);

                chart1.setOption({
                    tooltip: { trigger: 'axis' },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    xAxis: {
                        type: 'category', data: years,
                        axisLine: { lineStyle: { color: '#e5e7eb' } },
                        axisLabel: { color: '#6b7280' }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: { show: false },
                        splitLine: { lineStyle: { color: '#f3f4f6' } },
                        axisLabel: { color: '#6b7280' }
                    },
                    series: [{
                        data: enterprises, type: 'line', smooth: true, symbol: 'circle', symbolSize: 8,
                        lineStyle: { color: '#667eea', width: 3 },
                        itemStyle: { color: '#667eea' },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
                                { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
                            ])
                        }
                    }]
                });

                const chart2 = this.safeInitChart('chart-revenue');
                if (!chart2) return;

                const revenues = this.scaleData.map(d => d['产业营收_亿元']);

                chart2.setOption({
                    tooltip: { trigger: 'axis' },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    xAxis: {
                        type: 'category', data: years,
                        axisLine: { lineStyle: { color: '#e5e7eb' } },
                        axisLabel: { color: '#6b7280' }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: { show: false },
                        splitLine: { lineStyle: { color: '#f3f4f6' } },
                        axisLabel: { color: '#6b7280' }
                    },
                    series: [{
                        data: revenues, type: 'bar', barWidth: '50%',
                        itemStyle: {
                            borderRadius: [8, 8, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#10b981' },
                                { offset: 1, color: '#34d399' }
                            ])
                        }
                    }]
                });
            },

            renderMarketCharts() {
                if (this.scaleData.length === 0) return;

                const chart = this.safeInitChart('chart-market');
                if (!chart) return;

                const years = this.scaleData.map(d => d['年份']);

                chart.setOption({
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['企业数量', '产业营收', '产业增加值'], bottom: 0 },
                    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
                    xAxis: {
                        type: 'category', data: years,
                        axisLine: { lineStyle: { color: '#e5e7eb' } },
                        axisLabel: { color: '#6b7280' }
                    },
                    yAxis: [
                        { type: 'value', name: '金额(亿)', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f3f4f6' } } },
                        { type: 'value', name: '企业数', axisLine: { show: false }, splitLine: { show: false } }
                    ],
                    series: [
                        { name: '企业数量', type: 'bar', yAxisIndex: 1, data: this.scaleData.map(d => d['企业数量']), itemStyle: { color: '#667eea' } },
                        { name: '产业营收', type: 'line', smooth: true, data: this.scaleData.map(d => d['产业营收_亿元']), lineStyle: { color: '#10b981', width: 3 }, itemStyle: { color: '#10b981' } },
                        { name: '产业增加值', type: 'line', smooth: true, data: this.scaleData.map(d => d['产业增加值_亿元']), lineStyle: { color: '#f97316', width: 3 }, itemStyle: { color: '#f97316' } }
                    ]
                });

                const growthChart = this.safeInitChart('chart-growth');
                if (!growthChart) return;

                const revenueGrowth = [];
                const enterpriseGrowth = [];

                for (let i = 1; i < this.scaleData.length; i++) {
                    const prev = this.scaleData[i - 1];
                    const curr = this.scaleData[i];
                    revenueGrowth.push(((curr['产业营收_亿元'] - prev['产业营收_亿元']) / prev['产业营收_亿元'] * 100).toFixed(1));
                    enterpriseGrowth.push(((curr['企业数量'] - prev['企业数量']) / prev['企业数量'] * 100).toFixed(1));
                }

growthChart.setOption({
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['营收增长率', '企业增长率'], bottom: 0 },
                    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
                    xAxis: { type: 'category', data: years.slice(1) },
                    yAxis: { type: 'value', name: '%' },
                    series: [
                        { name: '营收增长率', type: 'bar', data: revenueGrowth, itemStyle: { color: '#10b981' } },
                        { name: '企业增长率', type: 'bar', data: enterpriseGrowth, itemStyle: { color: '#667eea' } }
                    ]
                });
            },

            renderCompetitionCharts() {
                if (this.enterpriseData.length === 0) return;

                const chart = this.safeInitChart('chart-competition');
                if (!chart) return;

                const sorted = [...this.enterpriseData].sort((a, b) => b['竞争力评分'] - a['竞争力评分']);

                chart.setOption({
                    tooltip: { trigger: 'axis' },
                    grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
                    xAxis: { type: 'value', max: 100 },
                    yAxis: { type: 'category', data: sorted.map(d => d['企业名称']).reverse(), axisLabel: { width: 100, overflow: 'truncate' } },
                    series: [{
                        type: 'bar',
                        data: sorted.map(d => d['竞争力评分']).reverse(),
                        itemStyle: {
                            borderRadius: [0, 6, 6, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#667eea' },
                                { offset: 1, color: '#a855f7' }
                            ])
                        },
                        label: { show: true, position: 'right', color: '#6b7280', fontSize: 12 }
                    }]
                });

                const sectorChart = this.safeInitChart('chart-sector');
                if (!sectorChart) return;

                const sectorCount = {};
                this.enterpriseData.forEach(d => {
                    sectorCount[d['所属环节']] = (sectorCount[d['所属环节']] || 0) + 1;
                });

                sectorChart.setOption({
                    tooltip: { trigger: 'item' },
                    legend: { bottom: 0 },
                    series: [{
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '45%'],
                        avoidLabelOverlap: false,
                        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
                        label: { show: false },
                        emphasis: { label: { show: true, fontSize: 13 } },
                        data: Object.entries(sectorCount).map(([name, value]) => ({ name, value }))
                    }]
                });
            },

            renderPredictionCharts() {
                if (this.scaleData.length === 0) return;

                // 渲染历史数据图表
                const historyChart = this.safeInitChart('chart-history');
                if (historyChart) {
                    let historical = [];
                    let fieldName = '';
                    const historyYears = this.scaleData.map(d => d['年份']);

                    if (this.predictionField === 'enterprise') {
                        historical = this.scaleData.map(d => d['企业数量']);
                        fieldName = '企业数量';
                    } else if (this.predictionField === 'revenue') {
                        historical = this.scaleData.map(d => d['产业营收_亿元']);
                        fieldName = '产业营收';
                    } else {
                        historical = this.innovationData.map(d => d['发明专利数量']);
                        fieldName = '发明专利';
                    }

                    historyChart.setOption({
                        tooltip: { trigger: 'axis' },
                        grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
                        xAxis: {
                            type: 'category', data: historyYears.map(y => y + '年'),
                            axisLine: { lineStyle: { color: '#e5e7eb' } },
                            axisLabel: { color: '#6b7280' }
                        },
                        yAxis: {
                            type: 'value',
                            axisLine: { show: false },
                            splitLine: { lineStyle: { color: '#f3f4f6' } },
                            axisLabel: { color: '#6b7280' }
                        },
                        series: [{
                            data: historical, type: 'line', smooth: true, symbol: 'circle', symbolSize: 10,
                            lineStyle: { color: '#667eea', width: 3 },
                            itemStyle: { color: '#667eea' },
                            label: { show: true, position: 'top', color: '#667eea', fontSize: 12, fontWeight: 'bold' },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
                                    { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
                                ])
                            }
                        }]
                    });
                }

                // 渲染预测数据图表
                const forecastChart = this.safeInitChart('chart-forecast');
                if (forecastChart) {
                    const predictionYears = ['2026年', '2027年', '2028年', '2029年', '2030年'];

                    if (this.predictedValues && this.hasPredicted) {
                        // 显示AI预测的数据
                        forecastChart.setOption({
                            tooltip: { trigger: 'axis' },
                            grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
                            xAxis: {
                                type: 'category', data: predictionYears,
                                axisLine: { lineStyle: { color: '#e5e7eb' } },
                                axisLabel: { color: '#6b7280' }
                            },
                            yAxis: {
                                type: 'value',
                                axisLine: { show: false },
                                splitLine: { lineStyle: { color: '#f3f4f6' } },
                                axisLabel: { color: '#6b7280' }
                            },
                            series: [{
                                data: this.predictedValues, type: 'line', smooth: true, symbol: 'circle', symbolSize: 12,
                                lineStyle: { color: '#f97316', width: 3 },
                                itemStyle: { color: '#f97316' },
                                label: { show: true, position: 'top', color: '#f97316', fontSize: 12, fontWeight: 'bold' },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(249, 115, 22, 0.3)' },
                                        { offset: 1, color: 'rgba(249, 115, 22, 0.05)' }
                                    ])
                                }
                            }]
                        });
                    } else {
                        // 显示等待状态
                        forecastChart.setOption({
                            title: {
                                text: '等待AI分析...',
                                left: 'center',
                                top: 'center',
                                textStyle: { color: '#9ca3af', fontSize: 14, fontWeight: 'normal' }
                            },
                            grid: { show: false },
                            xAxis: { show: false },
                            yAxis: { show: false },
                            series: []
                        });
                    }
                }
            },

            // 从AI返回的文本中解析预测数值
            parsePredictionValues(text) {
                const values = [];
                const patterns = [
                    /20\d{2}年[：:]\s*(\d+)/g,
                    /20\d{2}[：:]\s*(\d+)/g
                ];

                for (const pattern of patterns) {
                    let match;
                    while ((match = pattern.exec(text)) !== null) {
                        const value = parseInt(match[1]);
                        if (!isNaN(value) && value > 0) {
                            values.push(value);
                        }
                    }
                }

                // 如果没找到，尝试查找表格或列表格式的数字
                if (values.length < 5) {
                    const numbers = text.match(/\b\d{3,}\b/g);
                    if (numbers) {
                        numbers.forEach(n => {
                            const num = parseInt(n);
                            if (!isNaN(num) && num > 0 && values.length < 5) {
                                values.push(num);
                            }
                        });
                    }
                }

                return values.slice(0, 5);
            },

            async analyzeMarket() {
                this.analyzing = true;
                this.marketAnalysis = '';
                const result = await getMockMarketAnalysis();
                if (result) this.marketAnalysis = result;
                this.analyzing = false;
            },

            async analyzeCompetition() {
                this.analyzingCompetition = true;
                this.competitionAnalysis = '';
                const result = await getMockCompetitionAnalysis();
                if (result) this.competitionAnalysis = result;
                this.analyzingCompetition = false;
            },

            async predictTrend() {
                this.predicting = true;
                this.predictionResult = '';
                this.predictedValues = null;
                this.hasPredicted = false;

                // Use mock prediction responses
                const result = await getMockPredictionResponse(this.predictionField);

                if (result) {
                    this.predictionResult = result.text;
                    this.predictedValues = result.values;
                    this.hasPredicted = true;

                    // 重新渲染预测图表
                    this.$nextTick(() => {
                        this.renderPredictionCharts();
                    });
                }

                this.predicting = false;
            },

            // 生成默认预测值（当AI解析失败时使用）
            generateDefaultPrediction() {
                let historical = [];
                if (this.predictionField === 'enterprise') {
                    historical = this.scaleData.map(d => d['企业数量']);
                } else if (this.predictionField === 'revenue') {
                    historical = this.scaleData.map(d => d['产业营收_亿元']);
                } else {
                    historical = this.innovationData.map(d => d['发明专利数量']);
                }

                const predicted = [];
                let lastVal = historical[historical.length - 1];
                const recentGrowth = (historical[historical.length - 1] - historical[historical.length - 2]);
                const growthFactor = 1.08;

                for (let i = 0; i < 5; i++) {
                    lastVal = Math.round(lastVal + recentGrowth * growthFactor);
                    predicted.push(lastVal);
                }

                this.predictedValues = predicted;
                this.hasPredicted = true;

                this.$nextTick(() => {
                    this.renderPredictionCharts();
                });
            }
        },

        watch: {
            activeMenu() {
                this.$nextTick(() => {
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            console.log('切换菜单，渲染图表: ' + this.activeMenu);
                            this.renderCharts();
                            setTimeout(() => this.renderCharts(), 200);
                        }, 50);
                    });
                });
            },
            predictionField() {
                // 切换预测指标时重置预测状态
                this.predictedValues = null;
                this.hasPredicted = false;
                this.predictionResult = '';

                this.$nextTick(() => {
                    requestAnimationFrame(() => {
                        setTimeout(() => this.renderPredictionCharts(), 50);
                    });
                });
            }
        },

        mounted() {
            console.log('应用启动');
            this.loadData();

            window.addEventListener('resize', () => {
                document.querySelectorAll('[id^="chart-"]').forEach(el => {
                    const chart = echarts.getInstanceByDom(el);
                    if (chart) chart.resize();
                });
            });
        }
    });

    app.mount('#app');
