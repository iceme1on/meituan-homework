// 模拟数据 (Mock Data)
const mockData = {
    operation: {
        trend: {
            dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            orders: [1200, 1320, 1010, 1340, 2900, 3300, 3100],
            gmv: [22000, 24000, 20000, 25000, 46000, 52000, 49000]
        },
        funnel: [
            { value: 100, name: '浏览' },
            { value: 80, name: '加购' },
            { value: 60, name: '下单' },
            { value: 40, name: '支付' },
            { value: 20, name: '复购' }
        ]
    },
    merchant: {
        revenue: {
            categories: ['快餐', '饮品', '甜点', '正餐', '夜宵'],
            income: [5000, 3000, 2000, 8000, 4000]
        },
        products: [
            { value: 1048, name: '招牌牛肉面' },
            { value: 735, name: '波霸奶茶' },
            { value: 580, name: '提拉米苏' },
            { value: 484, name: '超级鸡腿堡' },
            { value: 300, name: '麻辣小龙虾' }
        ]
    },
    manager: {
        growth: {
            months: ['1月', '2月', '3月', '4月', '5月', '6月'],
            newUsers: [200, 300, 450, 500, 600, 800],
            activeUsers: [1000, 1200, 1500, 1800, 2200, 2600]
        },
        age: [
            { value: 300, name: '18-24岁' },
            { value: 500, name: '25-34岁' },
            { value: 200, name: '35-44岁' },
            { value: 100, name: '45岁以上' }
        ]
    }
};

// 角色配置
const roles = {
    operation: { title: "运营数据监控 - 订单与转化" },
    merchant: { title: "商户营收分析 - 收入与商品" },
    manager: { title: "平台综合管理 - 用户增长" }
};

// 全局变量存储图表实例，以便销毁
let chartInstances = [];

// DOM 元素
const navItems = document.querySelectorAll('.sidebar nav li');
const pageTitle = document.getElementById('page-title');
const dashboardContainer = document.getElementById('dashboard-container');

// 初始化
function init() {
    setupNavigation();
    loadDashboard('operation'); // 默认加载运营视图
}

// 设置导航点击事件
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const role = item.getAttribute('data-role');
            loadDashboard(role);
        });
    });
}

// 加载仪表盘内容
function loadDashboard(role) {
    // 1. 清理旧图表
    chartInstances.forEach(chart => chart.dispose());
    chartInstances = [];
    
    // 2. 更新标题和DOM结构
    pageTitle.textContent = roles[role].title;
    dashboardContainer.innerHTML = getHtmlStructure(role);

    // 3. 渲染新图表
    // 使用 setTimeout 确保 DOM 已经渲染完成
    setTimeout(() => {
        renderCharts(role);
    }, 0);
}

// 获取 HTML 结构
function getHtmlStructure(role) {
    if (role === 'operation') {
        return `
            <div class="chart-card full-width">
                <h3>近七日订单趋势 (Order Trend)</h3>
                <div class="chart-container" id="chart-trend"></div>
            </div>
            <div class="chart-card">
                <h3>用户转化漏斗 (Funnel)</h3>
                <div class="chart-container" id="chart-funnel"></div>
            </div>
             <div class="chart-card">
                <h3>实时核心指标</h3>
                <div style="display:flex; justify-content:space-around; align-items:center; height:100%; font-size:24px; font-weight:bold;">
                    <div>
                        <div style="font-size:14px; color:#666;">今日订单</div>
                        <div style="color:#FFC300;">12,345</div>
                    </div>
                    <div>
                         <div style="font-size:14px; color:#666;">GMV</div>
                        <div style="color:#2c3e50;">¥45.2W</div>
                    </div>
                </div>
            </div>
        `;
    } else if (role === 'merchant') {
        return `
            <div class="chart-card">
                <h3>分类收入占比 (Revenue Share)</h3>
                <div class="chart-container" id="chart-revenue"></div>
            </div>
            <div class="chart-card">
                <h3>热销商品 Top 5 (Top Products)</h3>
                <div class="chart-container" id="chart-products"></div>
            </div>
            <div class="chart-card full-width">
                <h3>店铺经营建议</h3>
                 <div style="padding:20px; color:#666; line-height:1.6;">
                    <p>💡 您的 <span style="color:#FFC300; font-weight:bold;">招牌牛肉面</span> 本周销量上涨 15%，建议增加备货。</p>
                    <p>💡 <span style="color:red; font-weight:bold;">饮品</span> 类目转化率略有下降，建议推出“第二杯半价”活动。</p>
                </div>
            </div>
        `;
    } else if (role === 'manager') {
        return `
            <div class="chart-card full-width">
                <h3>用户增长趋势 (User Growth)</h3>
                <div class="chart-container" id="chart-growth"></div>
            </div>
            <div class="chart-card">
                <h3>用户年龄分布 (Age Distribution)</h3>
                <div class="chart-container" id="chart-age"></div>
            </div>
            <div class="chart-card">
                <h3>平台风险监控</h3>
                <div class="chart-container" id="chart-risk"></div> <!-- 预留位置，本次简单模拟 -->
            </div>
        `;
    }
}

// 渲染图表
function renderCharts(role) {
    if (role === 'operation') {
        // 1. 趋势图
        const trendChart = echarts.init(document.getElementById('chart-trend'));
        trendChart.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['订单量', 'GMV'] },
            xAxis: { type: 'category', data: mockData.operation.trend.dates },
            yAxis: [
                { type: 'value', name: '订单量' },
                { type: 'value', name: 'GMV', axisLabel: { formatter: '¥{value}' } }
            ],
            series: [
                { name: '订单量', type: 'line', data: mockData.operation.trend.orders, smooth: true, itemStyle: { color: '#FFC300' } },
                { name: 'GMV', type: 'line', yAxisIndex: 1, data: mockData.operation.trend.gmv, smooth: true, itemStyle: { color: '#2c3e50' } }
            ]
        });
        chartInstances.push(trendChart);

        // 2. 漏斗图
        const funnelChart = echarts.init(document.getElementById('chart-funnel'));
        funnelChart.setOption({
            tooltip: { trigger: 'item' },
            series: [{
                name: '漏斗',
                type: 'funnel',
                left: '10%', top: 60, bottom: 60, width: '80%',
                min: 0, max: 100,
                minSize: '0%', maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: { show: true, position: 'inside' },
                itemStyle: { borderColor: '#fff', borderWidth: 1 },
                data: mockData.operation.funnel
            }]
        });
        chartInstances.push(funnelChart);

    } else if (role === 'merchant') {
        // 1. 收入柱状图
        const revChart = echarts.init(document.getElementById('chart-revenue'));
        revChart.setOption({
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: { type: 'category', data: mockData.merchant.revenue.categories },
            yAxis: { type: 'value' },
            series: [{
                data: mockData.merchant.revenue.income,
                type: 'bar',
                itemStyle: { color: '#FFC300' }
            }]
        });
        chartInstances.push(revChart);

        // 2. 商品饼图
        const prodChart = echarts.init(document.getElementById('chart-products'));
        prodChart.setOption({
            tooltip: { trigger: 'item' },
            legend: { top: '5%', left: 'center' },
            series: [{
                name: '销量',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                label: { show: false, position: 'center' },
                emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
                data: mockData.merchant.products
            }]
        });
        chartInstances.push(prodChart);

    } else if (role === 'manager') {
        // 1. 增长混合图
        const growthChart = echarts.init(document.getElementById('chart-growth'));
        growthChart.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['新增用户', '活跃用户'] },
            xAxis: { type: 'category', data: mockData.manager.growth.months },
            yAxis: { type: 'value' },
            series: [
                { name: '新增用户', type: 'bar', data: mockData.manager.growth.newUsers, itemStyle: { color: '#FFC300' } },
                { name: '活跃用户', type: 'line', data: mockData.manager.growth.activeUsers, itemStyle: { color: '#2c3e50' } }
            ]
        });
        chartInstances.push(growthChart);

        // 2. 年龄饼图
        const ageChart = echarts.init(document.getElementById('chart-age'));
        ageChart.setOption({
             tooltip: { trigger: 'item' },
             series: [{
                 type: 'pie',
                 radius: '50%',
                 data: mockData.manager.age,
                 emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
             }]
        });
        chartInstances.push(ageChart);
        
        // 3. 简单的仪表盘模拟风险分
         const riskChart = echarts.init(document.getElementById('chart-risk'));
         riskChart.setOption({
            series: [
                {
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 100,
                    splitNumber: 8,
                    axisLine: {
                        lineStyle: {
                            width: 6,
                            color: [
                                [0.25, '#FF6E76'],
                                [0.5, '#FDDD60'],
                                [0.75, '#58D9F9'],
                                [1, '#7CFFB2']
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 20,
                        offsetCenter: [0, '-60%'],
                        itemStyle: {
                        color: 'auto'
                        }
                    },
                    axisTick: { length: 12, lineStyle: { color: 'auto', width: 2 } },
                    splitLine: { length: 20, lineStyle: { color: 'auto', width: 5 } },
                    axisLabel: { color: '#464646', fontSize: 20, distance: -60, formatter: function (value) {
                            if (value === 90) { return '安全'; } else if (value === 10) { return '高危'; } return ''; }
                    },
                    detail: {
                        fontSize: 30,
                        offsetCenter: [0, '-35%'],
                        valueAnimation: true,
                        formatter: function (value) { return Math.round(value) + ' 分'; },
                        color: 'inherit'
                    },
                    data: [{ value: 85, name: '健康度' }]
                }
            ]
        });
         chartInstances.push(riskChart);
    }
    
    // 监听窗口大小变化，自适应调整
    window.addEventListener('resize', function() {
        chartInstances.forEach(chart => chart.resize());
    });
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);