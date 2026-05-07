import './assets/tailwind.css';
import './assets/main.scss';

import { createApp } from 'vue';
import App from './App.vue';

const mounted = new WeakSet<HTMLElement>();

function mountWidget(el: HTMLElement): void {
  if (mounted.has(el)) return;
  mounted.add(el);
  const props = JSON.parse(el.dataset.props || '{}');
  createApp(App, props).mount(el);
}

function mountAll(root: Document | HTMLElement): void {
  (root as Element).querySelectorAll<HTMLElement>('#altpilot-app').forEach(mountWidget);
}

// dom content loaded
document.addEventListener('DOMContentLoaded', () => {
  mountAll(document);

  // Observe DOM changes to mount newly added widgets dynamically
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.id === 'altpilot-app') {
          mountWidget(node);
        } else {
          mountAll(node);
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
});
