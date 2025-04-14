// 创建悬浮窗元素
function createFloatingWindow() {
  // 检查是否已存在悬浮窗
  if (document.querySelector('.image-uploader-float')) {
    return;
  }
  
  // 创建悬浮窗容器
  const floatWindow = document.createElement('div');
  floatWindow.className = 'image-uploader-float';
  
  // 创建悬浮窗头部
  const header = document.createElement('div');
  header.className = 'image-uploader-header';
  
  const title = document.createElement('h3');
  title.className = 'image-uploader-title';
  title.textContent = '111666图床上传';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'image-uploader-close';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => {
    floatWindow.style.display = 'none';
  });
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // 创建悬浮窗内容
  const content = document.createElement('div');
  content.className = 'image-uploader-content';
  
  // 创建拖放区域
  const dropArea = document.createElement('div');
  dropArea.className = 'image-uploader-droparea';
  dropArea.innerHTML = '<p>拖拽图片到此处或粘贴图片</p>';
  
  // 创建结果区域
  const resultArea = document.createElement('div');
  resultArea.className = 'image-uploader-result';
  
  const previewArea = document.createElement('div');
  previewArea.className = 'image-uploader-preview';
  previewArea.innerHTML = '<img src="" alt="预览图">';
  
  const linksArea = document.createElement('div');
  linksArea.className = 'image-uploader-links';
  
  // 创建Markdown链接区域
  const markdownLinkItem = document.createElement('div');
  markdownLinkItem.className = 'image-uploader-link-item';
  
  const markdownLabel = document.createElement('label');
  markdownLabel.textContent = 'Markdown格式:';
  
  const markdownInput = document.createElement('input');
  markdownInput.type = 'text';
  markdownInput.className = 'image-uploader-markdown';
  markdownInput.readOnly = true;
  
  const markdownCopyBtn = document.createElement('button');
  markdownCopyBtn.className = 'image-uploader-copy';
  markdownCopyBtn.textContent = '复制';
  markdownCopyBtn.dataset.target = 'image-uploader-markdown';
  
  markdownLinkItem.appendChild(markdownLabel);
  markdownLinkItem.appendChild(markdownInput);
  markdownLinkItem.appendChild(markdownCopyBtn);
  
  // 创建HTML链接区域
  const htmlLinkItem = document.createElement('div');
  htmlLinkItem.className = 'image-uploader-link-item';
  
  const htmlLabel = document.createElement('label');
  htmlLabel.textContent = 'HTML格式:';
  
  const htmlInput = document.createElement('input');
  htmlInput.type = 'text';
  htmlInput.className = 'image-uploader-html';
  htmlInput.readOnly = true;
  
  const htmlCopyBtn = document.createElement('button');
  htmlCopyBtn.className = 'image-uploader-copy';
  htmlCopyBtn.textContent = '复制';
  htmlCopyBtn.dataset.target = 'image-uploader-html';
  
  htmlLinkItem.appendChild(htmlLabel);
  htmlLinkItem.appendChild(htmlInput);
  htmlLinkItem.appendChild(htmlCopyBtn);
  
  // 创建URL链接区域
  const urlLinkItem = document.createElement('div');
  urlLinkItem.className = 'image-uploader-link-item';
  
  const urlLabel = document.createElement('label');
  urlLabel.textContent = 'URL:';
  
  const urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.className = 'image-uploader-url';
  urlInput.readOnly = true;
  
  const urlCopyBtn = document.createElement('button');
  urlCopyBtn.className = 'image-uploader-copy';
  urlCopyBtn.textContent = '复制';
  urlCopyBtn.dataset.target = 'image-uploader-url';
  
  urlLinkItem.appendChild(urlLabel);
  urlLinkItem.appendChild(urlInput);
  urlLinkItem.appendChild(urlCopyBtn);
  
  // 组装链接区域
  linksArea.appendChild(markdownLinkItem);
  linksArea.appendChild(htmlLinkItem);
  linksArea.appendChild(urlLinkItem);
  
  // 组装结果区域
  resultArea.appendChild(previewArea);
  resultArea.appendChild(linksArea);
  
  // 组装内容区域
  content.appendChild(dropArea);
  content.appendChild(resultArea);
  
  // 组装悬浮窗
  floatWindow.appendChild(header);
  floatWindow.appendChild(content);
  
  // 添加到页面
  document.body.appendChild(floatWindow);
  
  // 实现拖动功能
  makeDraggable(floatWindow, header);
  
  // 添加拖放事件处理
  setupDropEvents(dropArea, resultArea);
  
  // 添加复制功能
  setupCopyButtons();
  
  return floatWindow;
}

// 使元素可拖动
function makeDraggable(element, handle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  handle.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e.preventDefault();
    // 获取鼠标位置
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e.preventDefault();
    // 计算新位置
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // 设置元素的新位置
    element.style.top = (element.offsetTop - pos2) + 'px';
    element.style.left = (element.offsetLeft - pos1) + 'px';
  }
  
  function closeDragElement() {
    // 停止移动
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// 设置拖放事件
function setupDropEvents(dropArea, resultArea) {
  // 阻止默认拖放行为
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // 高亮拖放区域
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
      handleImageUpload(file, dropArea, resultArea);
    }
  });
  
  // 处理粘贴事件
  document.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        handleImageUpload(file, dropArea, resultArea);
        break;
      }
    }
  });
}

// 处理图片上传
function handleImageUpload(file, dropArea, resultArea) {
  // 获取Auth-Token
  chrome.storage.sync.get(['authToken'], (result) => {
    const authToken = result.authToken || '';
    
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
        'Auth-Token': authToken
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
      if (data && data.path) {
        const imageUrl = `https://i.111666.best/image/${data.path}`;
        displayResult(imageUrl, file, dropArea, resultArea);
      } else {
        throw new Error('上传失败: 无效的响应数据');
      }
    })
    .catch(error => {
      console.error('上传错误:', error);
      dropArea.innerHTML = `<p>上传失败: ${error.message}</p>`;
      setTimeout(() => {
        dropArea.innerHTML = '<p>拖拽图片到此处或粘贴图片</p>';
      }, 3000);
    });
  });
}

// 显示上传结果
function displayResult(imageUrl, file, dropArea, resultArea) {
  // 获取预览图片元素
  const previewImage = resultArea.querySelector('img');
  
  // 创建本地预览
  const objectUrl = URL.createObjectURL(file);
  previewImage.src = objectUrl;
  
  // 获取链接输入框
  const urlInput = resultArea.querySelector('.image-uploader-url');
  const markdownInput = resultArea.querySelector('.image-uploader-markdown');
  const htmlInput = resultArea.querySelector('.image-uploader-html');
  
  // 设置各种格式的链接
  urlInput.value = imageUrl;
  markdownInput.value = `![图片](${imageUrl})`;
  htmlInput.value = `<img src="${imageUrl}" alt="图片">`;
  
  // 显示结果区域
  resultArea.style.display = 'block';
  dropArea.innerHTML = '<p>拖拽图片到此处或粘贴图片</p>';
}

// 设置复制按钮功能
function setupCopyButtons() {
  document.querySelectorAll('.image-uploader-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetClass = btn.getAttribute('data-target');
      const input = document.querySelector('.' + targetClass);
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
}

// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleFloatingWindow') {
    const floatWindow = document.querySelector('.image-uploader-float') || createFloatingWindow();
    
    // 切换悬浮窗显示状态
    if (floatWindow.style.display === 'none' || floatWindow.style.display === '') {
      floatWindow.style.display = 'block';
    } else {
      floatWindow.style.display = 'none';
    }
    
    sendResponse({ success: true });
  }
  return true;
});