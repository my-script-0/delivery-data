document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const stats = data.bakeit_delivery_stats;
            
            // 1. تحديث الإحصائيات الرئيسية (نفس المنطق السابق)
            document.getElementById('partner-name').textContent = stats.partner_name_ar;
            document.getElementById('delivery-rate-main').textContent = (stats.last_4_months_delivery_rate * 100).toFixed(1) + '%';
            document.getElementById('avg-orders').textContent = stats.average_monthly_orders.toLocaleString('ar-EG');
            document.getElementById('avg-time').textContent = stats.avg_delivery_time_minutes;

            // 2. تحديث رضى العملاء بالنجوم
            const rating = stats.customer_satisfaction_rating.toFixed(1);
            document.getElementById('satisfaction-rating').textContent = rating;
            
            const starsContainer = document.getElementById('stars');
            const fullStars = Math.floor(stats.customer_satisfaction_rating);
            
            starsContainer.innerHTML = ''; // تفريغ المحتوى
            for (let i = 0; i < 5; i++) {
                let starClass = '☆'; // نجمة فارغة
                if (i < fullStars) {
                    starClass = '★'; // نجمة ممتلئة
                } else if (i === fullStars && (stats.customer_satisfaction_rating - fullStars) >= 0.5) {
                    // Chart.js لا يدعم النجوم النصفية مباشرة، لذا نكتفي هنا بالنجمة الكاملة أو الفارغة في هذا المثال المبسط
                    // يمكن استخدام أيقونات أكثر تعقيداً لتضمين النجمة النصفية
                }
                starsContainer.innerHTML += `<span style="color: ${i < fullStars ? '#ffc107' : '#e4e5e9'};">${starClass}</span>`;
            }

            // 3. **إنشاء الرسم البياني باستخدام Chart.js**
            const monthlyData = stats.delivery_performance_by_month;
            const labels = monthlyData.map(item => item.month); // أسماء الأشهر
            const deliveryRates = monthlyData.map(item => (item.rate * 100).toFixed(1)); // نسب التوصيل

            const ctx = document.getElementById('monthlyPerformanceChart').getContext('2d');
            
            new Chart(ctx, {
                type: 'line', // نوع الرسم البياني: خطي
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'نسبة التوصيل الشهري (%)',
                        data: deliveryRates,
                        backgroundColor: 'rgba(231, 111, 81, 0.4)', // لون تعبئة فاتح
                        borderColor: '#e76f51', // لون خط الرسم البياني (اللون الأساسي)
                        borderWidth: 3,
                        tension: 0.4, // لجعل الخط منحنيًا وأكثر نعومة
                        pointRadius: 6,
                        pointBackgroundColor: '#e76f51'
                    }]
                },
                options: {
                    responsive: true,
                    // جعل اتجاه الرسم البياني مناسبًا للعربية (اختياري)
                    // direction: 'rtl',
                    // rtl: true,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 50, // بدء المحور من 50% لتحسين رؤية الفروقات
                            max: 100,
                            title: {
                                display: true,
                                text: 'نسبة النجاح %'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        },
                        tooltip: {
                             // تحويل أرقام الـ tooltip لتظهر بشكل نسبة مئوية
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y + '%';
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
            
        })
        .catch(error => console.error('Error fetching data or rendering chart:', error));
});
