// 获取DOM元素
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const selectFileBtn = document.getElementById('selectFileBtn');
const resultArea = document.getElementById('resultArea');
const previewImage = document.getElementById('previewImage');
const markdownLink = document.getElementById('markdownLink');
const htmlLink = document.getElementById('htmlLink');
const urlLink = document.getElementById('urlLink');
const authTokenInput = document.getElementById('authToken');
const saveTokenBtn = document.getElementById('saveToken');

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  // 清空Auth-Token输入框
  authTokenInput.value = '';
});

// 导入雪花ID生成器
import snowflake from './snowflake.js';

// 移除Auth-Token输入变化监听器，改为只读模式
authTokenInput.readOnly = true;

// 监听Auth-Token输入变化
authTokenInput.addEventListener('change', () => {
  let token = authTokenInput.value.trim();
  if (token) {
    chrome.storage.sync.set({ authToken: token });
  }
});

// 选择文件按钮点击事件
selectFileBtn.addEventListener('click', () => {
  fileInput.click();
});

// 文件选择事件
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    handleImageUpload(file);
  }
});

// 拖拽事件处理
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  dropArea.classList.add('highlight');
}

function unhighlight() {
  dropArea.classList.remove('highlight');
}

// 处理拖放的文件
dropArea.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const file = dt.files[0];
  
  if (file && file.type.startsWith('image/')) {
    handleImageUpload(file);
  }
});

// 处理粘贴事件
document.addEventListener('paste', (e) => {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      handleImageUpload(file);
      break;
    }
  }
});

// 处理图片上传
function handleImageUpload(file) {
  // 生成新的Auth-Token
  const newAuthToken = snowflake.nextId();
  
  // 保存新生成的Auth-Token
  chrome.storage.sync.set({ authToken: newAuthToken }, () => {
    // 更新输入框显示
    document.getElementById('authToken').value = newAuthToken;
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('image', file);
    
    // 显示上传中状态
    dropArea.innerHTML = '<p>上传中...</p>';
    
    // 发送上传请求
    fetch('https://i.111666.best/image', {
      method: 'POST',
      body: formData,
      headers: {
        'Auth-Token': newAuthToken
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('上传失败: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      // 处理上传成功的响应
      if (data && data.ok && data.src) {
        const imageUrl = `https://i.111666.best${data.src}`;
        displayResult(imageUrl, file);
      } else {
        throw new Error('上传失败: 无效的响应数据');
      }
    })
    .catch(error => {
      console.error('上传错误:', error);
      dropArea.innerHTML = `<p>上传失败: ${error.message}</p><button id="selectFileBtn">重试</button>`;
      document.getElementById('selectFileBtn').addEventListener('click', () => {
        fileInput.click();
      });
    });
  });
}

// 显示上传结果
function displayResult(imageUrl, file) {
  // 创建本地预览
  const objectUrl = URL.createObjectURL(file);
  previewImage.src = objectUrl;
  
  // 获取文件名作为图片说明
  const fileName = file.name;
  
  // 设置各种格式的链接
  urlLink.value = imageUrl;
  markdownLink.value = `![${fileName}](${imageUrl})`;
  htmlLink.value = `<img src="${imageUrl}" alt="${fileName}">`;
  
  // 显示结果区域，隐藏上传区域
  resultArea.style.display = 'block';
  dropArea.innerHTML = '<p>拖拽图片到此处或粘贴图片</p><button id="selectFileBtn">选择图片</button>';
  document.getElementById('selectFileBtn').addEventListener('click', () => {
    fileInput.click();
  });
}

// 复制链接按钮事件
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    input.select();
    document.execCommand('copy');
    
    // 显示复制成功提示
    const originalText = btn.textContent;
    btn.textContent = '已复制';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  });
});