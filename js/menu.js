document.addEventListener('DOMContentLoaded', function() {
    // ==================================================================
    // ## FUNCIONALIDADE DO MENU HAMBÚRGUER
    // ==================================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.querySelector('.nav-links');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            // Alterna a classe 'active' no menu de links, fazendo-o aparecer ou desaparecer
            navMenu.classList.toggle('active');
        });

        // Opcional, mas recomendado: Fecha o menu se um link for clicado
        navMenu.addEventListener('click', (e) => {
            // Verifica se o menu está ativo antes de tentar fechar
            if (navMenu.classList.contains('active')) {
                // Fecha o menu se o clique foi em um link
                if (e.target.tagName === 'A') {
                   navMenu.classList.remove('active');
                }
            }
        });
    }
});