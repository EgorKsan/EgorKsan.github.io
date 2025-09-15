(function() {
    function showFatalError(messageEn) {
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.background = '#111';
        el.style.color = '#fff';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.flexDirection = 'column';
        el.style.zIndex = '9999';
        el.style.fontSize = '20px';
        el.style.textAlign = 'center';
        el.innerHTML = `
            <img src="Source/SadIcon.png" alt="Error" style="width:64px;height:64px;margin-bottom:20px;">
            <p>Oops... something went wrong</p>
            <p>${messageEn}</p>
            <button id="reload-btn" style="
                margin-top:20px;
                padding:10px 20px;
                font-size:16px;
                background:#444;
                border:none;
                color:#fff;
                cursor:pointer;
            ">Reload page</button>
        `;
        document.body.innerHTML = '';
        document.body.appendChild(el);

        // Reload Btn
        document.getElementById('reload-btn').addEventListener('click', () => {
            location.reload(true);
        });
    }

    // Catching unhandled errors
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error || e.message);
        showFatalError('The site may be under maintenance. Please try again later.');
    });

    // Catching errors in promises
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        showFatalError('The site may be under maintenance. Please try again later.');
    });
})();
