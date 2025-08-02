// 在原有的script中添加以下代码
document.addEventListener('DOMContentLoaded', function() {
    // 生成年份选项（近5年）
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    }

    // 生成月份选项
    const monthSelect = document.getElementById('month');
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = i;
        if (i === new Date().getMonth() + 1) {
            option.selected = true;
        }
        monthSelect.appendChild(option);
    }

    // 生成日期选项（会根据月份动态调整）
    function updateDays() {
        const daySelect = document.getElementById('day');
        const year = parseInt(document.getElementById('year').value);
        const month = parseInt(document.getElementById('month').value);
        
        // 清空现有选项
        daySelect.innerHTML = '';
        
        // 计算当月天数
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // 添加日期选项
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i;
            if (i === new Date().getDate()) {
                option.selected = true;
            }
            daySelect.appendChild(option);
        }
    }

    // 初始化日期选项
    updateDays();
    
    // 当月份或年份变化时更新日期选项
    document.getElementById('year').addEventListener('change', updateDays);
    document.getElementById('month').addEventListener('change', updateDays);

    // 表单提交前合并日期
    const form = document.querySelector('form[action="http://dailytimelist.com:3000/addtask"]');
    form.addEventListener('submit', function(e) {
        const year = document.getElementById('year').value;
        const month = document.getElementById('month').value;
        const day = document.getElementById('day').value;
        const dateInput = document.getElementById('date');
        
        // 合并为 yyyy/mm/dd 格式
        dateInput.value = `${year}/${month}/${day}`;
    });
});

function createHourOptions(selectId, defaultHour) {
            const select = document.getElementById(selectId);
            for (let i = 0; i < 24; i++) {
                const hour = i.toString().padStart(2, '0');
                const option = document.createElement('option');
                option.value = hour;
                option.textContent = hour;
                if (hour === defaultHour) {
                    option.selected = true;
                }
                select.appendChild(option);
            }
        }

        // 生成分钟选项（00-59，每15分钟一个间隔）
function createMinuteOptions(selectId, defaultMinute) {
    const select = document.getElementById(selectId);
    for (let i = 0; i < 60; i += 15) { // 可改为i++实现每分钟一个选项
                const minute = i.toString().padStart(2, '0');
                const option = document.createElement('option');
                option.value = minute;
                option.textContent = minute;
                if (minute === defaultMinute) {
                    option.selected = true;
                }
                select.appendChild(option);
            }
}

        // 初始化时间选项
        document.addEventListener('DOMContentLoaded', function() {
            const now = new Date();
            const currentHour = now.getHours().toString().padStart(2, '0');
            let nextHour = (now.getHours() + 1) % 24;
            nextHour = nextHour.toString().padStart(2, '0');
            const currentMinute = Math.ceil(now.getMinutes() / 15) * 15;
            const defaultMinute = currentMinute.toString().padStart(2, '0');

            // 初始化开始时间
            createHourOptions('startHour', currentHour);
            createMinuteOptions('startMinute', defaultMinute);

            // 初始化结束时间（默认比开始时间晚1小时）
            createHourOptions('endHour', nextHour);
            createMinuteOptions('endMinute', defaultMinute);

            // 监听表单提交，合并时间
            const form = document.querySelector('form');
            if (form) {
                form.addEventListener('submit', function() {
                    // 合并开始时间
                    const startHour = document.getElementById('startHour').value;
                    const startMinute = document.getElementById('startMinute').value;
                    document.getElementById('starttime').value = `${startHour}:${startMinute}`;

                    // 合并结束时间
                    const endHour = document.getElementById('endHour').value;
                    const endMinute = document.getElementById('endMinute').value;
                    document.getElementById('endtime').value = `${endHour}:${endMinute}`;
                });
            }
        });
