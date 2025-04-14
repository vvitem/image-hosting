// 监听快捷键命令
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-floating-window') {
    // 获取当前活动标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        // 向内容脚本发送消息
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'toggleFloatingWindow' },
          (response) => {
            // 处理响应
            if (chrome.runtime.lastError) {
              console.error('Error:', chrome.runtime.lastError);
            }
          }
        );
      }
    });
  }
});

// 监听扩展安装或更新事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 首次安装时显示欢迎页面或设置页面
    chrome.tabs.create({
      url: 'popup.html'
    });
  }
});