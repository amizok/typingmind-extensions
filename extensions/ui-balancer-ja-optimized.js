// ─── UIタブ設定 (UI Tab Settings) ───
(function() {
  // 各タブごとにテキストやフォントサイズを個別に調整

  // Chat Tab (チャットタブ)
  const chatButton = document.querySelector('[data-element-id="workspace-tab-chat"] .font-semibold');
  if (chatButton) {
    chatButton.style.fontSize = '0.6rem';
  }

  // Agents Tab (エージェントタブ)
  const agentsButton = document.querySelector('[data-element-id="workspace-tab-agents"] .font-normal');
  if (agentsButton) {
    agentsButton.textContent = 'エージェント';
    agentsButton.style.fontSize = '0.55rem';
  }

  // Prompts Tab (プロンプトタブ)
  const promptButton = document.querySelector('[data-element-id="workspace-tab-prompts"] .font-normal');
  if (promptButton) {
    promptButton.textContent = 'プロンプト';
    promptButton.style.fontSize = '0.6rem';
  }

  // Plugins Tab (プラグインタブ)
  const pluginsButton = document.querySelector('[data-element-id="workspace-tab-plugins"] .font-normal');
  if (pluginsButton) {
    pluginsButton.style.fontSize = '0.6rem';
  }

  // Models Tab (モデルタブ)
  const modelsButton = document.querySelector('[data-element-id="workspace-tab-models"] .font-normal');
  if (modelsButton) {
    modelsButton.style.fontSize = '0.6rem';
  }

  // Teams Tab (チームタブ)
  const teamsButton = document.querySelector('[data-element-id="workspace-tab-teams"] .font-normal');
  if (teamsButton) {
    teamsButton.style.fontSize = '0.6rem';
  }

  // Settings Tab (設定タブ)
  const settingsButton = document.querySelector('[data-element-id="workspace-tab-settings"] .font-normal');
  if (settingsButton) {
    settingsButton.style.fontSize = '0.6rem';
  }

})();

// ─── 統合されたDOM監視システム ───
(function() {
  const observedElements = new Set();
  
  // 各機能のハンドラー
  const handlers = {
    // チャット削除ボタン
    chatDeleteButtons: function(node) {
      if (node.matches && node.matches('[aria-label="チャットを削除"]')) {
        this.setupDeleteButtonObserver(node, 'chat');
      }
      
      const chatDeleteButtons = node.querySelectorAll ? node.querySelectorAll('[aria-label="チャットを削除"]') : [];
      chatDeleteButtons.forEach(button => this.setupDeleteButtonObserver(button, 'chat'));
    },

    // プロジェクト/フォルダ削除ボタン
    projectDeleteButtons: function(node) {
      if (node.matches && node.matches('[aria-label="プロジェクト/フォルダを削除"]')) {
        this.setupDeleteButtonObserver(node, 'project');
      }
      
      const projectDeleteButtons = node.querySelectorAll ? node.querySelectorAll('[aria-label="プロジェクト/フォルダを削除"]') : [];
      projectDeleteButtons.forEach(button => this.setupDeleteButtonObserver(button, 'project'));
    },

    // メニュー形式削除ボタン
    menuDeleteButtons: function(node) {
      if (node.matches && (
        node.matches('button[role="menuitem"].text-red-500') || 
        (node.matches('button[role="menuitem"]') && node.classList.contains('text-red-500'))
      )) {
        const span = node.querySelector('span');
        if (span && span.textContent.trim() === 'よろしいですか？') {
          this.setupDeleteButtonObserver(node, 'menu');
        }
      }
      
      const menuDeleteButtons = node.querySelectorAll ? node.querySelectorAll('button[role="menuitem"].text-red-500, button[role="menuitem"][class*="text-red-500"]') : [];
      menuDeleteButtons.forEach(button => {
        const span = button.querySelector('span');
        if (span && span.textContent.trim() === 'よろしいですか？') {
          this.setupDeleteButtonObserver(button, 'menu');
        }
      });
    },

    // エージェントヘッダー（デスクトップ）
    agentHeaderDesktop: function(node) {
      if (node.matches && node.matches('[data-element-id="character-list-header"]')) {
        this.setupHeaderObserver(node, 'desktop');
      }
      
      const headerContainer = node.querySelector ? node.querySelector('[data-element-id="character-list-header"]') : null;
      if (headerContainer) {
        this.setupHeaderObserver(headerContainer, 'desktop');
      }
    },

    // エージェントヘッダー（モバイル）
    agentHeaderMobile: function(node) {
      if (node.matches && node.matches('div.block.md\\:hidden.px-6.pt-4.space-y-1')) {
        this.setupHeaderObserver(node, 'mobile');
      }
      
      const mobileHeaderContainer = node.querySelector ? node.querySelector('div.block.md\\:hidden.px-6.pt-4.space-y-1') : null;
      if (mobileHeaderContainer) {
        this.setupHeaderObserver(mobileHeaderContainer, 'mobile');
      }
    },

    // チャット入力ボタン
    chatInputButtons: function(node) {
      if (node.matches && (
        node.matches('[data-element-id="toggle-kb-button"]') || 
        node.matches('[data-element-id="toggle-thinking-button"]')
      )) {
        this.setupButtonObserver(node);
      }
      
      const inputButtons = node.querySelectorAll ? node.querySelectorAll('[data-element-id="toggle-kb-button"], [data-element-id="toggle-thinking-button"]') : [];
      inputButtons.forEach(button => this.setupButtonObserver(button));
    },

    // 削除ボタンの共通処理
    setupDeleteButtonObserver: function(button, type) {
      const key = `delete-${type}-${button.getAttribute('aria-label') || 'menu'}-${Math.random()}`;
      if (observedElements.has(key)) return;
      
      observedElements.add(key);
      
      const adjustText = () => {
        const span = button.querySelector('span');
        if (span && span.textContent.trim() === 'よろしいですか？') {
          span.textContent = '削除';
          span.style.whiteSpace = 'nowrap';
          span.style.textDecoration = 'none';
        }
      };
      
      adjustText();
      
      const observer = new MutationObserver(adjustText);
      observer.observe(button, { childList: true, subtree: true });
    },

    // ヘッダーの共通処理
    setupHeaderObserver: function(container, type) {
      const key = `header-${type}-${container.dataset.elementId || 'mobile'}-${Math.random()}`;
      if (observedElements.has(key)) return;
      
      observedElements.add(key);
      
      const updateText = () => {
        const header = container.querySelector('h2');
        if (header && header.textContent.trim() === '代理') {
          header.textContent = 'エージェント';
        }
      };
      
      updateText();
      
      const observer = new MutationObserver(updateText);
      observer.observe(container, { childList: true, subtree: true, characterData: true });
    },

    // ボタンテキストの共通処理
    setupButtonObserver: function(button) {
      const key = `button-${button.dataset.elementId}-${Math.random()}`;
      if (observedElements.has(key)) return;
      
      observedElements.add(key);
      
      const adjustText = () => {
        const spans = button.querySelectorAll('span.text-xs.font-medium');
        spans.forEach(span => {
          if (span.textContent.trim() === 'KB検索') {
            span.textContent = 'Search KB';
          } else if (span.textContent.trim() === '考えてみよう') {
            span.textContent = 'Think';
          }
        });
      };
      
      adjustText();
      
      const observer = new MutationObserver(adjustText);
      observer.observe(button, { childList: true, subtree: true });
    }
  };

  // 単一のMutationObserverで全体を監視
  const globalObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        
        // 各ハンドラーを実行
        Object.keys(handlers).forEach(key => {
          if (typeof handlers[key] === 'function' && key !== 'setupDeleteButtonObserver' && key !== 'setupHeaderObserver' && key !== 'setupButtonObserver') {
            handlers[key].call(handlers, node);
          }
        });
      });
    });
  });

  // 高頻度で変更される可能性の低い、より具体的なコンテナを監視
  const targetContainers = [
    '#__next', // Next.jsのルートコンテナ
    '[data-testid="app"]', // アプリケーションのメインコンテナ
    'main', // メインコンテンツエリア
    '.app' // 一般的なアプリケーションコンテナ
  ];

  let observerAttached = false;
  
  targetContainers.forEach(selector => {
    const container = document.querySelector(selector);
    if (container && !observerAttached) {
      globalObserver.observe(container, { childList: true, subtree: true });
      observerAttached = true;
    }
  });

  // フォールバック: 適切なコンテナが見つからない場合のみbodyを監視
  if (!observerAttached) {
    globalObserver.observe(document.body, { childList: true, subtree: true });
  }

  // 初期状態の要素も処理
  document.addEventListener('DOMContentLoaded', () => {
    // 既存の要素を処理
    Object.keys(handlers).forEach(key => {
      if (typeof handlers[key] === 'function' && key !== 'setupDeleteButtonObserver' && key !== 'setupHeaderObserver' && key !== 'setupButtonObserver') {
        handlers[key].call(handlers, document.body);
      }
    });
  });

  // すでにDOMが読み込まれている場合の処理
  if (document.readyState === 'loading') {
    // DOMContentLoadedイベントを待つ
  } else {
    // すでに読み込み完了している場合は即座に実行
    Object.keys(handlers).forEach(key => {
      if (typeof handlers[key] === 'function' && key !== 'setupDeleteButtonObserver' && key !== 'setupHeaderObserver' && key !== 'setupButtonObserver') {
        handlers[key].call(handlers, document.body);
      }
    });
  }
})();