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

// ─── チャット削除ボタンテキストの調整 ───
(function() {
  const observedButtons = new Set();

  // 対象の削除ボタン内にある <span> のテキストを即座に修正（「よろしいですか？」→「削除」）
  function adjustDeletionText(button) {
    const span = button.querySelector('span');
    if (span && span.textContent.trim() === 'よろしいですか？') {
      span.textContent = '削除';
      span.style.whiteSpace = 'nowrap';
      span.style.textDecoration = 'none';
    }
  }

  // 削除ボタン（およびその子孫）の変化があれば、テキストを修正するMutationObserverを設定
  function observeDeleteButton(button) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 直接追加されたnodeが<span>の場合、または子孫に<span>が存在する場合
            const span = node.matches('span') ? node : node.querySelector('span');
            if (span && span.textContent.trim() === 'よろしいですか？') {
              span.textContent = '削除';
              span.style.whiteSpace = 'nowrap';
              span.style.textDecoration = 'none';
            }
          }
        });
        // 変更後に全体の状態を再チェック
        adjustDeletionText(button);
      });
    });

    observer.observe(button, { childList: true, subtree: true });
  }

  // 追加されたノードをチェックし、削除ボタンがあれば監視を開始する
  function processAddedNode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    // 追加されたノードがすでに削除ボタンの場合
    if (node.matches('[aria-label="チャットを削除"]')) {
      if (!observedButtons.has(node)) {
        observedButtons.add(node);
        observeDeleteButton(node);
        adjustDeletionText(node);
      }
    }

    // 追加されたノードの子孫に削除ボタンが含まれている場合
    const deleteButtons = node.querySelectorAll('[aria-label="チャットを削除"]');
    deleteButtons.forEach((button) => {
      if (!observedButtons.has(button)) {
        observedButtons.add(button);
        observeDeleteButton(button);
        adjustDeletionText(button);
      }
    });
  }

  // body全体に対してMutationObserverを設定し、削除ボタンの追加を監視する
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        processAddedNode(node);
      });
    });
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });

  // 初期状態で既に存在している削除ボタンも監視対象に追加
  document.querySelectorAll('[aria-label="チャットを削除"]').forEach((button) => {
    if (!observedButtons.has(button)) {
      observedButtons.add(button);
      observeDeleteButton(button);
      adjustDeletionText(button);
    }
  });
})();

// ─── エージェント画面のタイトル調整 ───
(function() {
  // ----- デスクトップヘッダー (data-element-id="character-list-header" 内) -----
  let headerObserver;

  function updateHeaderText(container) {
    const header = container.querySelector('h2');
    if (header && header.textContent.trim() === '代理') {
      header.textContent = 'エージェント';
    }
  }

  function observeHeaderContainer(container) {
    updateHeaderText(container);

    if (headerObserver) headerObserver.disconnect();
    headerObserver = new MutationObserver(() => {
      updateHeaderText(container);
    });

    headerObserver.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function initHeaderObserver() {
    const container = document.querySelector('[data-element-id="character-list-header"]');
    if (container) {
      observeHeaderContainer(container);
    }
  }

  initHeaderObserver();

  // ページ全体の変化に対応（SPA対応）
  const bodyObserverDesktop = new MutationObserver(() => {
    const container = document.querySelector('[data-element-id="character-list-header"]');
    if (container) {
      observeHeaderContainer(container);
    }
  });

  bodyObserverDesktop.observe(document.body, {
    childList: true,
    subtree: true
  });

  // ----- モバイルヘッダー (クラス指定のコンテナ内) -----
  let mobileHeaderObserver;

  function updateMobileHeaderText(container) {
    const header = container.querySelector('h2');
    if (header && header.textContent.trim() === '代理') {
      header.textContent = 'エージェント';
    }
  }

  function observeMobileHeaderContainer(container) {
    updateMobileHeaderText(container);

    if (mobileHeaderObserver) mobileHeaderObserver.disconnect();
    mobileHeaderObserver = new MutationObserver(() => {
      updateMobileHeaderText(container);
    });

    mobileHeaderObserver.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function initMobileHeaderObserver() {
    // モバイルヘッダーのコンテナはクラス名で指定 (コロン(:)はエスケープが必要)
    const container = document.querySelector('div.block.md\\:hidden.px-6.pt-4.space-y-1');
    if (container) {
      observeMobileHeaderContainer(container);
    }
  }

  initMobileHeaderObserver();

  const bodyObserverMobile = new MutationObserver(() => {
    const container = document.querySelector('div.block.md\\:hidden.px-6.pt-4.space-y-1');
    if (container) {
      observeMobileHeaderContainer(container);
    }
  });

  bodyObserverMobile.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

// ─── ボタンテキスト変更 (Button Text Changes) ───
(function() {
  function updateButtonTexts() {
    // KB検索ボタン -> Search KB
    const kbButton = document.querySelector('[data-element-id="toggle-kb-button"] .text-xs.font-medium.sm\\:inline-block.hidden');
    if (kbButton) {
      kbButton.textContent = 'Search KB';
    }

    // 考えてみようボタン -> Think
    const thinkingButton = document.querySelector('[data-element-id="toggle-thinking-button"] .text-xs.font-medium.sm\\:inline-block.hidden');
    if (thinkingButton) {
      thinkingButton.textContent = 'Think';
    }
  }

  // 初回実行
  updateButtonTexts();

  // MutationObserverでDOM変更を監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // 子要素の追加・削除を検知
      if (mutation.type === 'childList') {
        updateButtonTexts();
      }
    });
  });

  // document全体を監視対象に設定
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

