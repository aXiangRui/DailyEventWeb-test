// 确保DOM加载完成后再执行操作
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面DOM加载完成');

  // 初始化：读取本地存储的模式
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
  }

  // 点击按钮切换模式
  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    // 保存状态到本地存储
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
    
    // 显示当前日期时间 - 修复todayDateTime元素问题
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = now.toLocaleDateString('zh-CN', options);
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const formattedTime = now.toLocaleTimeString('zh-CN', timeOptions);
    
    const todayDateEl = document.getElementById('todayDate');
    const todayTimeEl = document.getElementById('todayDateTime');
    
    if (todayDateEl) {
        todayDateEl.textContent = formattedDate;
    } else {
        console.error('未找到todayDate元素');
    }
    
    // 修复：增加容错处理，避免后续代码报错
    if (todayTimeEl) {
        //todayTimeEl.textContent = `当前时间: ${formattedTime}`;
        
        // 实时更新时间
        setInterval(() => {
            const currentTime = new Date().toLocaleTimeString('zh-CN', timeOptions);
            //todayTimeEl.textContent = `当前时间: ${currentTime}`;
        }, 1000);
    } else {
        console.warn('未找到todayDateTime元素，时间显示功能已禁用');
        // 自动创建默认元素
        const fallbackTimeEl = document.createElement('div');
        fallbackTimeEl.id = 'todayDateTime';
        //fallbackTimeEl.textContent = `当前时间: ${formattedTime}`;
        document.body.prepend(fallbackTimeEl);
    }
});

// 全局变量
let currentWeekOffset = 0;

// 周范围计算函数
function getWeekRange(offset = 0) {
    const now = new Date();
    const baseDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (offset * 7)
    );
    
    const dayOfWeek = baseDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const weekStart = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() - daysToMonday
    );
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate() + 6
    );
    weekEnd.setHours(23, 59, 59, 999);

    return { start: weekStart, end: weekEnd };
}

function createWeekNavigation() {
  // 找到HTML中你定义的容器
  const weekContainer = document.getElementById('weekNavContainer');
  if (!weekContainer) {
    console.error('请先在HTML中添加id为weekNavContainer的容器');
    return;
  }

  // 避免重复创建
  if (weekContainer.querySelector('#prevWeekBtn')) return;

  // 创建按钮（逻辑不变）
  const prevBtn = document.createElement('button');
  prevBtn.id = 'prevWeekBtn';
  prevBtn.textContent = '上一周';
  prevBtn.addEventListener('click', () => changeWeek(-1));

  const weekLabel = document.createElement('span');
  weekLabel.id = 'weekLabel';
  weekLabel.style.margin = '0 15px';

  const nextBtn = document.createElement('button');
  nextBtn.id = 'nextWeekBtn';
  nextBtn.textContent = '下一周';
  nextBtn.addEventListener('click', () => changeWeek(1));

  // 插入到HTML容器中（关键：位置由HTML的weekNavContainer决定）
  weekContainer.appendChild(prevBtn);
  weekContainer.appendChild(weekLabel);
  weekContainer.appendChild(nextBtn);

  updateWeekLabel();
}

// 更新周标签
function updateWeekLabel() {
    const { start, end } = getWeekRange(currentWeekOffset);
    const startStr = start.toLocaleDateString('zh-CN');
    const endStr = end.toLocaleDateString('zh-CN');
    const label = document.getElementById('weekLabel');
    if (label) {
        label.textContent = `${startStr} - ${endStr}`;
    }
}

// 切换周
function changeWeek(delta) {
    currentWeekOffset += delta;
    updateWeekLabel();
    loadAndRenderTasks();
}

// 初始化备注弹窗 - 修复closeBtn未定义问题
// function initNoteModal() {
//     if (document.getElementById('noteModal')) return;
    
//     const modal = document.createElement('div');
//     modal.id = 'noteModal';
//     modal.className = 'note-modal';
    
//     const modalContent = document.createElement('div');
//     modalContent.className = 'note-modal-content';
    
//     // 正确定义closeBtn并绑定事件
//     const closeBtn = document.createElement('span');
//     closeBtn.className = 'close-btn';
//     closeBtn.innerHTML = '&times;';
//     closeBtn.addEventListener('click', () => hideTaskNote());
    
//     // 任务ID显示
//     const taskIdEl = document.createElement('div');
//     taskIdEl.className = 'task-id';
    
//     // 备注标题
//     const titleEl = document.createElement('h3');
//     titleEl.textContent = '任务备注';
    
//     // 备注内容容器
//     const noteContent = document.createElement('div');
//     noteContent.id = 'noteContent';
    
//     // 任务时间信息
//     const timeInfo = document.createElement('div');
//     timeInfo.id = 'taskTimeInfo';
    
//     // 添加删除按钮
//     const deleteBtn = document.createElement('button');
//     deleteBtn.className = 'delete-btn';
//     deleteBtn.textContent = '删除此任务';
//     deleteBtn.addEventListener('click', async () => {
//         const currentTaskId = modalContent.dataset.taskId;
//         if (!currentTaskId) {
//             alert('未获取到任务ID');
//             return;
//         }
        
//         if (confirm(`确定要删除任务ID为 ${currentTaskId} 的任务吗？`)) {
//             try {
//                 const response = await fetch('http://localhost:3000/deltask', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ TaskID: currentTaskId })
//                 });
                
//                 const result = await response.json();
//                 if (result.success) {
//                     alert('删除成功');
//                     hideTaskNote();
//                     window.location.reload();
//                 } else {
//                     alert('删除失败：' + (result.message || '未知错误'));
//                 }
//             } catch (err) {
//                 console.error('删除请求失败：', err);
//                 alert('网络错误，删除失败');
//             }
//         }
//     });
    
//     // 组装弹窗
//     modalContent.appendChild(closeBtn);
//     modalContent.appendChild(taskIdEl);
//     modalContent.appendChild(titleEl);
//     modalContent.appendChild(noteContent);
//     modalContent.appendChild(timeInfo);
//     modalContent.appendChild(deleteBtn);
//     modal.appendChild(modalContent);
//     document.body.appendChild(modal);
    
//     // 点击弹窗外部关闭
//     modal.addEventListener('click', (e) => {
//         if (e.target === modal) {
//             hideTaskNote();
//         }
//     });
// }

// // 显示任务备注
// function showTaskNote(task) {
//     initNoteModal();
    
//     const modal = document.getElementById('noteModal');
//     const noteContent = document.getElementById('noteContent');
//     const taskIdEl = document.querySelector('.task-id');
//     const timeInfo = document.getElementById('taskTimeInfo');
//     const modalContent = document.querySelector('.note-modal-content');

//     if (modalContent) {
//         modalContent.dataset.taskId = task.TaskID;
//     }
    
//     if (taskIdEl) {
//         taskIdEl.textContent = `任务 ID: ${task.TaskID || '未知'}`;
//     }
    
//     if (noteContent) {
//         noteContent.textContent = task.note || '该任务没有备注信息';
//     }
    
//     if (timeInfo) {
//         timeInfo.innerHTML = `
//             <p>日期: ${task.date || '未知'}</p>
//             <p>时间: ${task.starttime || '未知'} - ${task.endtime || '未知'}</p>
//             <p>用户: ${task.userID || '未知'}</p>
//         `;
//     }
    
//     if (modal) {
//         modal.style.display = 'flex';
//         setTimeout(() => {
//             modal.classList.add('active');
//         }, 10);
//     }
// }

// 隐藏任务备注弹窗
function hideTaskNote() {
    const modal = document.getElementById('noteModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// 加载并渲染任务 - 修复taskBody初始化顺序问题
async function loadAndRenderTasks() {
    // 1. 先获取所有必要元素（确保在使用前初始化）
    const taskContainer = document.querySelector('.task-container');
    const taskBody = document.getElementById('taskBody');
    const emptyTip = document.getElementById('emptyTip');
    
    // 2. 检查元素是否存在，不存在则创建默认元素
    if (!taskContainer) {
        console.warn('未找到task-container，创建默认容器');
        const defaultContainer = document.createElement('div');
        defaultContainer.className = 'task-container';
        defaultContainer.style.minHeight = '300px';
        document.body.appendChild(defaultContainer);
        return; // 重新调用以使用新创建的元素
    }
    
    if (!taskBody) {
        console.warn('未找到taskBody，创建默认表格主体');
        const defaultTable = document.createElement('table');
        const defaultBody = document.createElement('tbody');
        defaultBody.id = 'taskBody';
        defaultTable.appendChild(defaultBody);
        document.body.appendChild(defaultTable);
        return loadAndRenderTasks(); // 重新调用
    }
    
    if (!emptyTip) {
        console.warn('未找到emptyTip，创建默认提示元素');
        const defaultTip = document.createElement('div');
        defaultTip.id = 'emptyTip';
        defaultTip.style.display = 'none';
        defaultTip.textContent = '暂无任务数据';
        document.body.appendChild(defaultTip);
        return loadAndRenderTasks(); // 重新调用
    }

    try {
        // 清空现有内容
        taskContainer.innerHTML = '';
        taskBody.innerHTML = '';
        emptyTip.style.display = 'none';

        // 获取任务数据
        console.log('请求任务数据...');
        const response = await fetch('http://localhost:3000/userTasks');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            const { start: weekStart, end: weekEnd } = getWeekRange(currentWeekOffset);
            const weekStartTimestamp = weekStart.getTime();
            const weekEndTimestamp = weekEnd.getTime();
            
            // 过滤当前周任务
            const validTasks = result.data.filter(task => {
                if (task.is_del !== 0) return false;
                if (!task.date) return false;
                
                const [year, month, day] = task.date.split('/').map(Number);
                const taskDate = new Date(year, month - 1, day);
                const taskTimestamp = taskDate.getTime();
                
                return taskTimestamp >= weekStartTimestamp && taskTimestamp <= weekEndTimestamp;
            });

            if (validTasks.length > 0) {
                let html = '';
                let firstUserID = null;
                let splitIndex = -1;
                
                validTasks.forEach((task, index) => {
                    // 生成表格行
                    html += `
                        <tr>
                            <td>${task.userID || '-'}</td>
                            <td>${task.TaskID || '-'}</td>
                            <td>${task.starttime || '-'}</td>
                            <td>${task.endtime || '-'}</td>
                            <td>${task.date || '-'}</td>
                            <td>${task.title || '-'}</td>
                            <td>${task.note || '无备注'}</td>
                        </tr>
                    `;
                    
                    // 处理用户分割逻辑
                    if (splitIndex === -1) {
                        if (firstUserID === null) {
                            firstUserID = task.userID;
                        } else if (task.userID !== firstUserID) {
                            splitIndex = index;
                        }
                    }
                    
                    // 渲染到时间轴（假设你有这个函数）
                    if (typeof renderTaskToTimeline === 'function') {
                        renderTaskToTimeline(task, taskContainer, index, splitIndex);
                    }
                });
                
                taskBody.innerHTML = html;
                emptyTip.style.display = 'none';
            } else {
                emptyTip.style.display = 'block';
                emptyTip.textContent = '当前周暂无任务数据';
            }
        } else {
            emptyTip.style.display = 'block';
            emptyTip.textContent = result.message || '暂无任务数据';
        }

    } catch (err) {
        console.error('获取任务失败:', err);
        emptyTip.style.display = 'block';
        emptyTip.textContent = '加载失败，请检查网络或后端服务';
    }
}

// 页面完全加载后初始化
window.onload = function() {
    console.log('页面完全加载完成，开始初始化');
    // 初始化弹窗（确保closeBtn被定义）
    initNoteModal();
    // 创建周导航
    createWeekNavigation();
    // 加载任务（此时所有元素已初始化）
    loadAndRenderTasks();
};

// 时间轴渲染函数（如果有此函数请保留，确保任务块能正确显示）
function renderTaskToTimeline(task, container, index, splitIndex) {
    // 这里是你的任务块渲染逻辑
    // 例如：创建任务块元素并添加到容器中
    try {
        // 解析时间并计算位置（根据你的实际需求调整）
        const startTime = parseTimeToHours(task.starttime);
        const endTime = parseTimeToHours(task.endtime);
        if (startTime === null || endTime === null) return;
        
        // 计算任务日期对应的星期几（用于列定位）
        const [year, month, day] = task.date.split('/').map(Number);
        const taskDate = new Date(year, month - 1, day);
        const dayOfWeek = taskDate.getDay() || 7; // 转换为1-7（周一到周日）
        
        // 计算位置和尺寸（示例值，根据实际布局调整）
        const hourHeight = 600.0/24; // 每小时的高度像素
        const columnWidth = 1000/8; // 每列的宽度像素
        
        const taskBlock = document.createElement('div');
        taskBlock.className = 'task-block';
        taskBlock.style.top = `${startTime * hourHeight}px`;
        taskBlock.style.left = `${dayOfWeek * columnWidth}px`;
        taskBlock.style.height = `${Math.max(30, (endTime - startTime) * hourHeight)}px`;
        taskBlock.style.width = `${columnWidth - 10}px`;
        
        // 设置不同用户的颜色区分
        // const color1 = 'rgba(37, 148, 222, 0.7)';
        // const color2 = 'rgba(242, 160, 194, 0.7)';
        // taskBlock.style.backgroundColor = splitIndex === -1 ? color1 : (index < splitIndex ? color1 : color2);

        // 在renderTaskToTimeline函数中，替换颜色设置部分
        // 移除原来的backgroundColor设置，改为添加类的逻辑
        if (splitIndex === -1) {
            taskBlock.classList.add('user-1');
        } else {
            taskBlock.classList.add(index < splitIndex ? 'user-1' : 'user-2');
        }
        
        taskBlock.textContent = task.title || '无备注';
        taskBlock.addEventListener('click', () => showTaskNote(task));
        
        container.appendChild(taskBlock);
    } catch (err) {
        console.error('渲染任务到时间轴失败:', err);
    }
}

// 辅助函数：将时间字符串转换为小时数
function parseTimeToHours(timeStr) {
    if (!timeStr) return null;
    const parts = timeStr.split(':').map(Number);
    if (parts.length !== 2) return null;
    return parts[0] + parts[1] / 60;
}


// 辅助函数：解析时间为小时数
function parseTimeToHours(timeStr) {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
        return null;
    }
    return hours + minutes / 60;
}

// 表单切换函数
function toggleSubmitBox() {
    const box = document.getElementById("submitBox");
    if (box) box.style.display = box.style.display === "none" ? "block" : "none";
    else console.error('未找到submitBox元素');
}

function toggleAddPartner() {
    const box = document.getElementById("addPartner");
    if (box) box.style.display = box.style.display === "none" ? "block" : "none";
    else console.error('未找到addPartner元素');
}

function toggleDeleteBox() {
    const box = document.getElementById("deleteBox");
    if (box) box.style.display = box.style.display === "none" ? "block" : "none";
    else console.error('未找到deleteBox元素');
}

// 生成时间标签（检查容器是否存在）
const timeContainer = document.querySelector('.time-container');
if (timeContainer) {
    for (let hour = 0; hour < 24; hour++) {
        const label = document.createElement('div');
        label.className = 'time-label';
        label.textContent = `${hour}:00`;
        timeContainer.appendChild(label);
    }
} else {
    console.error('未找到.time-container元素（时间轴）');
}

// 修改hideTaskNote函数（需要在代码中添加此函数）
function hideTaskNote() {
    const modal = document.getElementById('noteModal');
    if (modal) {
        // 先移除动画类，触发退出动画
        modal.classList.remove('active');
        // 等待动画结束后再隐藏
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // 与CSS动画时长保持一致
    }
}

// 同时检查关闭按钮的事件绑定是否正确
// 在initNoteModal函数中确保关闭按钮绑定正确：
closeBtn.addEventListener('click', hideTaskNote);

// 显示任务备注
function initNoteModal() {
    // 检查是否已创建弹窗，避免重复创建
    if (document.getElementById('noteModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'noteModal';
    modal.className = 'note-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'note-modal-content';
    
    // 关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => hideTaskNote());
    
    // 任务ID显示
    const taskIdEl = document.createElement('div');
    taskIdEl.className = 'task-id';
    
    // 备注标题
    const noteEl = document.createElement('h3');
    noteEl.textContent = '任务备注';

    const titleEl = document.createElement('h3');
    titleEl.textContent = '任务标题';

    // 备注内容容器
    const noteContent = document.createElement('div');
    noteContent.id = 'noteContent';
    
    // 任务时间信息
    const timeInfo = document.createElement('div');
    timeInfo.id = 'taskTimeInfo';

    // 添加删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '删除此任务';
    deleteBtn.addEventListener('click', async () => {
        const currentTaskId = modalContent.dataset.taskId;
    if (!currentTaskId) {
        alert('未获取到任务ID');
        return;
    }
    
    if (confirm(`确定要删除任务ID为 ${currentTaskId} 的任务吗？`)) {
        try {
            const response = await fetch('http://localhost:3000/deltask', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // 添加CSRF令牌（如果需要）
                    // 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ TaskID: currentTaskId }) // 确保键名与后端一致
            });
            
            const result = await response.json();
            if (result.success) {
                alert('删除成功');
                hideTaskNote();
                window.location.reload(); // 刷新页面
            } else {
                alert('删除失败：' + (result.message || '未知错误'));
            }
        } catch (err) {
            console.error('删除请求失败：', err);
            alert('网络错误，删除失败');
        }
    }
    });
    
    // 组装弹窗（修复：添加删除按钮，移除错误的appendChild）
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(taskIdEl);
    modalContent.appendChild(titleEl);
    modalContent.appendChild(noteEl);
    modalContent.appendChild(noteContent);
    modalContent.appendChild(timeInfo);
    modalContent.appendChild(deleteBtn); // 添加上删除按钮
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 点击弹窗外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideTaskNote();
        }
    });
}

// 显示任务备注（修复：正确获取modalContent）
function showTaskNote(task) {
    // 确保弹窗已初始化
    initNoteModal();
    
    const modal = document.getElementById('noteModal');
    const noteContent = document.getElementById('noteContent');
    const taskIdEl = document.querySelector('.task-id');
    const timeInfo = document.getElementById('taskTimeInfo');
    const modalContent = document.querySelector('.note-modal-content');
    const titleEl = document.querySelector('.note-modal-content h3:nth-of-type(1)'); 
    // 正确获取弹窗内容元素

    if (modalContent) {
        modalContent.dataset.taskId = task.TaskID; // 修复：使用获取到的modalContent
    }
    
    // 填充内容
    if (taskIdEl) {
        taskIdEl.textContent = `任务 ID: ${task.TaskID || '未知'}`;
    }
    
    if (noteContent) {
        noteContent.textContent = task.note || '该任务没有备注信息';
    }
    
    if (timeInfo) {
        timeInfo.innerHTML = `
            <p>日期: ${task.date || '未知'}</p>
            <p>时间: ${task.starttime || '未知'} - ${task.endtime || '未知'}</p>
            <p>用户: ${task.userID || '未知'}</p>
        `;
    }

    if (titleEl) {
        titleEl.textContent = `任务标题: ${task.title || '未知'}`;
    }
    
    // 显示弹窗并添加动画
    if (modal) {
        modal.style.display = 'flex';
        // 触发动画（添加active类）
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}