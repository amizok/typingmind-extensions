(function() {
  // ─── UIタブ設定 (UI Tab Settings) ───
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

  // ─── チャット削除ボタンテキストの調整 ───
  // 既に監視対象に追加済みの削除ボタンを管理するセット
  const observedButtons = new Set();

  // 対象の削除ボタン内にある <span> のテキストを即座に修正（「よろしいですか？」→「削除」）
  const adjustDeletionText = (button) => {
    const span = button.querySelector('span');
    if (span && span.textContent === 'よろしいですか？') {
      span.textContent = '削除';
      span.style.whiteSpace = 'nowrap';
      span.style.textDecoration = 'none';
    }
  };

  // 指定した削除ボタンに対してMutationObserverを設定し、内部の変化を監視する
  const observeDeleteButton = (button) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const span = node.matches('span') ? node : node.querySelector('span');
            if (span && span.textContent === 'よろしいですか？') {
              span.textContent = '削除';
              span.style.whiteSpace = 'nowrap';
              span.style.textDecoration = 'none';
            }
          }
        });
        // 子要素の変更後に全体を再チェックする
        adjustDeletionText(button);
      });
    });
    observer.observe(button, { childList: true, subtree: true });
  };

  // 動的に追加される削除ボタンを定期的にチェックして、必要に応じて監視を開始する
  const checkDeleteButtons = () => {
    const deleteButtons = document.querySelectorAll('[aria-label="チャットを削除"]');
    deleteButtons.forEach(button => {
      if (!observedButtons.has(button)) {
        observedButtons.add(button);
        observeDeleteButton(button);
        // すでに表示されているボタンの即時修正
        adjustDeletionText(button);
      }
    });
  };

  // 500msごとに削除ボタンのチェックを行う（環境に合わせて間隔調整可能）
  setInterval(checkDeleteButtons, 500);
})();

