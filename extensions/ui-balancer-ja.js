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
    agentsButton.style.fontSize = '0.5rem';
  }

  // Prompts Tab (プロンプトタブ)
  const promptButton = document.querySelector('[data-element-id="workspace-tab-prompts"] .font-normal');
  if (promptButton) {
    promptButton.textContent = 'プロンプト';
    promptButton.style.fontSize = '0.5rem';
  }

  // Plugins Tab (プラグインタブ)
  const pluginsButton = document.querySelector('[data-element-id="workspace-tab-plugins"] .font-normal');
  if (pluginsButton) {
    pluginsButton.style.fontSize = '0.5rem';
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
  let headerObserver; // ヘッダー専用のObserverを保持

  // ヘッダー内のh2要素を更新する関数
  function updateHeaderText(container) {
    const header = container.querySelector('h2');
    if (header && header.textContent.trim() === '代理') {
      header.textContent = 'エージェント';
      console.log("ヘッダーのテキストを'代理'から'エージェント'に変更しました。");
    }
  }

  // ヘッダーコンテナに対してMutationObserverを設定し、変化があればテキスト更新を実行
  function observeHeaderContainer(container) {
    updateHeaderText(container);

    // 既存のObserverがあれば切断
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

  // ヘッダーコンテナが存在するか初期チェックを実施
  function initHeaderObserver() {
    const container = document.querySelector('[data-element-id="character-list-header"]');
    if (container) {
      observeHeaderContainer(container);
    }
  }

  // 初期化：ページロード時にヘッダーの存在をチェック
  initHeaderObserver();

  // SPA等で動的に要素が追加されるケースに対応するため、
  // document.body全体に対して監視を開始し、ヘッダーコンテナが新たに追加された場合に再設定する
  const bodyObserver = new MutationObserver(() => {
    const container = document.querySelector('[data-element-id="character-list-header"]');
    if (container) {
      observeHeaderContainer(container);
    }
  });

  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

