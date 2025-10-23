document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const stats = data.bakeit_delivery_stats;
            
            // 1. عرض اسم الشريك
            document.getElementById('partner-name').textContent = stats.partner_name_ar;

            // 2. نسبة التوصيل الرئيسية
            const rate = (stats.last_4_months_delivery_rate * 100).toFixed(0) + '%';
            document.getElementById('delivery-rate-main').textContent = rate;

            // 3. معدل الطلبات
            document.getElementById('avg-orders').textContent = stats.average_monthly_orders.toLocaleString('ar-EG');

            // 4. متوسط وقت التوصيل
            document.getElementById('avg-time').textContent = stats.avg_delivery_time_minutes;

            // 5. رضى العملاء
            const rating = stats.customer_satisfaction_rating.toFixed(1);
            document.getElementById('satisfaction-rating').textContent = rating;
            
            // إضافة النجوم (تخيل أن النجمة هي ★)
            const starsContainer = document.getElementById('stars');
            const fullStars = Math.floor(stats.customer_satisfaction_rating);
            const partialStar = stats.customer_satisfaction_rating - fullStars;

            // مثال: 4 نجوم كاملة ونصف نجمة
            for (let i = 0; i < fullStars; i++) {
                starsContainer.innerHTML += '★'; // نجمة كاملة
            }
            if (partialStar >= 0.25) {
                starsContainer.innerHTML += '½'; // نجمة نصفية (لتمثيل الكسر)
            }
            
            // 6. تفصيل أداء الأشهر (الجدول)
            const tableBody = document.querySelector('#monthly-performance-table tbody');
            stats.delivery_performance_by_month.forEach(item => {
                const row = tableBody.insertRow();
                
                row.insertCell().textContent = item.month;
                row.insertCell().textContent = (item.rate * 100).toFixed(1) + '%';
                row.insertCell().textContent = item.orders.toLocaleString('ar-EG');
            });
            
        })
        .catch(error => console.error('Error fetching data:', error));
});
