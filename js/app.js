/**
 * Aplicação Principal - Página Setorial FAMINAS
 * Extensão Universitária • Engenharia de Software • ADS
 */

import { initModalController } from './modal-controller.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o gerenciador de modais institucionais (Sobre, Termos, Privacidade)
  initModalController();

  console.log('[InfoHub Setorial] Template institucional inicializado com sucesso.');

  /* ==========================================================================
     ESPAÇO PARA LÓGICA ESPECÍFICA DOS ESTUDANTES (OPCIONAL):
     Exemplos de funcionalidades que vocês podem adicionar:
     - Copiar telefone/e-mail para a área de transferência ao clicar em um botão
     - Filtragem de dúvidas frequentes ou cálculo de prazos
     - Alternância de visualizações ou accordions interativos
     ========================================================================== */

  /* --------------------------------------------------------------------------
     1) Simulador do limite de dependências (limite oficial: 7)
     -------------------------------------------------------------------------- */
  const LIMITE_DEPENDENCIAS = 7;
  const depInput = document.getElementById('dep-count');
  const depResult = document.getElementById('dep-result');
  const depMeter = document.getElementById('dep-meter');
  const depFill = document.getElementById('dep-meter-fill');

  function atualizarSimulador() {
    if (!depInput || !depResult || !depFill) return;
    const total = Math.max(0, parseInt(depInput.value, 10) || 0);
    const percentual = Math.min(100, (total / LIMITE_DEPENDENCIAS) * 100);

    depFill.style.width = `${percentual}%`;
    depFill.classList.toggle('is-limit', total === LIMITE_DEPENDENCIAS);
    depFill.classList.toggle('is-over', total > LIMITE_DEPENDENCIAS);
    depMeter?.setAttribute('aria-valuenow', String(Math.min(total, LIMITE_DEPENDENCIAS)));

    if (total > LIMITE_DEPENDENCIAS) {
      depResult.textContent = `Com ${total} dependências você ultrapassa o limite de ${LIMITE_DEPENDENCIAS}: isso obriga a reter e voltar de período. Procure a Coordenação.`;
    } else if (total === LIMITE_DEPENDENCIAS) {
      depResult.textContent = `Você está exatamente no limite de ${LIMITE_DEPENDENCIAS}. Qualquer dependência a mais obriga a reter.`;
    } else if (total === 0) {
      depResult.textContent = 'Nenhuma dependência: você está dentro do limite.';
    } else {
      const restantes = LIMITE_DEPENDENCIAS - total;
      depResult.textContent = `Você está dentro do limite e ainda pode ter mais ${restantes} ${restantes === 1 ? 'dependência' : 'dependências'}.`;
    }
  }

  depInput?.addEventListener('input', atualizarSimulador);
  atualizarSimulador();

  /* --------------------------------------------------------------------------
     2) Busca nas dúvidas frequentes
     -------------------------------------------------------------------------- */
  const faqSearch = document.getElementById('faq-search');
  const faqItems = document.querySelectorAll('#faq-list .faq-item');
  const faqEmpty = document.getElementById('faq-empty');

  const normalizar = (texto) =>
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  faqSearch?.addEventListener('input', () => {
    const termo = normalizar(faqSearch.value.trim());
    let visiveis = 0;

    faqItems.forEach((item) => {
      const combina = !termo || normalizar(item.textContent).includes(termo);
      item.hidden = !combina;
      if (combina) visiveis += 1;
    });

    if (faqEmpty) faqEmpty.hidden = visiveis > 0;
  });

  /* --------------------------------------------------------------------------
     3) Copiar dados de contato para a área de transferência
     -------------------------------------------------------------------------- */
  document.querySelectorAll('[data-copy]').forEach((botao) => {
    const rotulo = botao.querySelector('span:last-child');
    const textoOriginal = rotulo?.textContent;

    botao.addEventListener('click', async () => {
      const valor = botao.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(valor);
      } catch {
        const campo = document.createElement('textarea');
        campo.value = valor;
        campo.setAttribute('readonly', '');
        campo.style.position = 'fixed';
        campo.style.opacity = '0';
        document.body.appendChild(campo);
        campo.select();
        document.execCommand('copy');
        campo.remove();
      }
      botao.classList.add('is-copied');
      if (rotulo) rotulo.textContent = 'Copiado!';
      setTimeout(() => {
        botao.classList.remove('is-copied');
        if (rotulo) rotulo.textContent = textoOriginal;
      }, 2000);
    });
  });
});
