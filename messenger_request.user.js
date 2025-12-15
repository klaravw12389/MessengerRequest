// ==UserScript==
// @name         Gmail Messenger Request
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Request delivery via Active Transport Services
// @author       Antigravity
// @match        *://mail.google.com/*
// @include      *://mail.google.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("Gmail Messenger Request: Script starting...");

    // --- Data ---
    const addresses = [
        {
            name: "30TH",
            short: "APPARATUS Studio 30th st",
            full: "APPARATUS Studio\nAttn: Sam O'Brien\n124 West 30th Street\nNew York, NY 10001"
        },
        {
            name: "RH",
            short: "80 Richards",
            full: "APPARATUS Red Hook\nAttn: Receiving\n80 Richards Street, 4th FL\nBrooklyn, NY 11231\n347.246.4210 Ext 163"
        },
        {
            name: "Blacktable",
            short: "Blacktable Studios",
            full: "Blacktable Studio / NYC Laser Cut\nAttn: Fiona\n805 Rockaway Ave, Unit 5\nBrooklyn, NY 11212\nPhone:   (347) 335-0228"
        },
        {
            name: "Metalworks",
            short: "Metalworks",
            full: "Attn: Michael\nMetalworks Inc., 1303 Herschell Street, \nBronx, NY, 10461\n212-695-3114"
        },
        {
            name: "Continental Die",
            short: "Continental Die",
            full: "Continental Die\nAttn: Danny\n115 West 25th Street\nNew York, NY 10001\n212-242-0642"
        },
        {
            name: "Libra",
            short: "LIBRA LEATHER",
            full: "LIBRA LEATHER\nAttn: Valentina Taylor\n199 Lafayette Street, Unit 5D\nNew York, NY, 10012\n212-695-3114\n*Temporary Address*"
        },
        {
            name: "NJWJ",
            short: "New Jersey Waterjet",
            full: "New Jersey Waterjet \nAttn: Larry\nNew Jersey Waterjet, 725 Lehigh Avenue\nUnit 4, Union, NJ,  07083\n732-910-1602"
        },
        {
            name: "DSA",
            short: "DSA Finishing",
            full: "DSA FINISHING attn: Diego\n130-16 91st Avenue\nRichmond Hill, New York 11418\nUnited States\n(718) 821-2124"
        },
        {
            name: "CL Precision",
            short: "CL Precision",
            full: "CL Precision\nAttn: George Lolis\n50-15 70th Street\nWoodside, NY 11377\nPhone:   718-651-8475"
        },
        {
            name: "KLN",
            short: "KLN Studio",
            full: "KLN Studio\nAttn: Toby Newman\n79 Grattan Street\nBrooklyn, NY, 11237\n707.291.6159"
        }
    ];

    const packages = [
        {
            name: "Cocktail top",
            description: "SEGMENT OCCASIONAL TABLE TOP: 10.25\" x 13\" x 2.875\", ~5 lbs."
        },
        {
            name: "Side table top",
            description: "SEGMENT SIDE TABLE TOP:"
        }
    ];

    const RECIPIENTS = {
        to: "active orders <ordersforactive@gmail.com>",
        cc: "Procurement APPARATUS <procurement@apparatusstudio.com>,Jessica Soha APPARATUS <jessica.soha@apparatusstudio.com>,Jared Brosky APPARATUS <jared.brosky@apparatusstudio.com>,APPARATUS Shipping <shipping@apparatusstudio.com>,Vance Cherebin APPARATUS <vance.cherebin@apparatusstudio.com>"
    };

    // --- UI Styles ---
    const styles = `
        #mr-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
        }
        #mr-modal {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: sans-serif;
        }
        #mr-modal h2 {
            margin-top: 0;
            color: #333;
        }
        .mr-field {
            margin-bottom: 15px;
        }
        .mr-field label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 12px;
            color: #555;
        }
        .mr-field select, .mr-field input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .mr-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .mr-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .mr-btn-primary {
            background: #1a73e8;
            color: white;
        }
        .mr-btn-secondary {
            background: #f1f3f4;
            color: #333;
        }
        /* Floating button style for fallback */
        #mr-trigger-btn.mr-floating {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9998;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            background-color: #1a73e8 !important;
            color: white !important;
            padding: 12px 24px;
            border-radius: 24px;
            font-family: 'Google Sans', sans-serif;
            font-weight: 500;
            cursor: pointer;
        }
        /* Sidebar button style */
        #mr-trigger-btn.mr-sidebar {
            margin-top: 10px;
            cursor: pointer;
            background-color: #f2f6fc;
            color: #202124;
            border: 1px solid transparent;
            border-radius: 24px;
            height: 48px;
            padding: 0 24px;
            font-family: 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            font-size: 14px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: box-shadow .28s cubic-bezier(0.4,0,0.2,1),background-color .28s cubic-bezier(0.4,0,0.2,1);
            /* Ensure it takes up space in the column if needed, or aligns left */
            margin-left: 8px; 
        }
        #mr-trigger-btn.mr-sidebar:hover {
            box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3),0 1px 3px 1px rgba(60,64,67,0.15);
            background-color: #e8f0fe;
        }
        
        /* Toast notification */
        #mr-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #323232;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-family: sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: fadeOut 0.5s ease-in-out 4.5s forwards;
        }
        @keyframes fadeOut {
            to { opacity: 0; visibility: hidden; }
        }
    `;

    // --- Helper Functions ---
    function addStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function showToast() {
        const toast = document.createElement('div');
        toast.id = 'mr-toast';
        toast.textContent = 'Messenger Request Script Loaded';
        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 5000);
    }

    function getTomorrow() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }

    function formatDate(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return {
            dayName: days[date.getDay()],
            dateFormatted: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
            dayNumber: date.getDate(),
            monthAbbr: months[date.getMonth()],
            year: date.getFullYear()
        };
    }

    function createField(labelText, inputType, id, placeholder, options) {
        const div = document.createElement('div');
        div.className = 'mr-field';

        const label = document.createElement('label');
        label.textContent = labelText;
        div.appendChild(label);

        let input;
        if (inputType === 'select') {
            input = document.createElement('select');
            input.id = id;
            options.forEach((opt, idx) => {
                const option = document.createElement('option');
                option.value = idx;
                option.textContent = opt.text;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.id = id;
            if (placeholder) input.placeholder = placeholder;
        }
        div.appendChild(input);
        return div;
    }

    function createModal() {
        if (document.getElementById('mr-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'mr-modal-overlay';

        const modal = document.createElement('div');
        modal.id = 'mr-modal';

        const h2 = document.createElement('h2');
        h2.textContent = 'Messenger Request';
        modal.appendChild(h2);

        // From
        const fromOptions = addresses.map(addr => ({ text: `${addr.name} (${addr.short})` }));
        modal.appendChild(createField('From', 'select', 'mr-from', null, fromOptions));

        // To
        const toOptions = addresses.map(addr => ({ text: `${addr.name} (${addr.short})` }));
        modal.appendChild(createField('To', 'select', 'mr-to', null, toOptions));

        // Package
        const pkgOptions = packages.map(pkg => ({ text: pkg.name }));
        modal.appendChild(createField('Package', 'select', 'mr-package', null, pkgOptions));

        // PO Number
        modal.appendChild(createField('PO Number', 'text', 'mr-po', 'e.g. 12345'));

        // Pickup Time
        modal.appendChild(createField('Pickup Time', 'text', 'mr-pickup', 'e.g. 10:00 AM'));

        // Dropoff Time
        modal.appendChild(createField('Dropoff Time', 'text', 'mr-dropoff', 'e.g. 2:00 PM'));

        // User Name
        const savedName = localStorage.getItem('mr_username') || '';
        const nameField = createField('Your Name', 'text', 'mr-username', 'Your Name');
        nameField.querySelector('input').value = savedName;
        modal.appendChild(nameField);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'mr-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'mr-btn mr-btn-secondary';
        cancelBtn.id = 'mr-cancel';
        cancelBtn.textContent = 'Cancel';
        actions.appendChild(cancelBtn);

        const createBtn = document.createElement('button');
        createBtn.className = 'mr-btn mr-btn-primary';
        createBtn.id = 'mr-create';
        createBtn.textContent = 'Create Email';
        actions.appendChild(createBtn);

        modal.appendChild(actions);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Events
        cancelBtn.onclick = () => {
            overlay.style.display = 'none';
        };

        createBtn.onclick = generateEmail;

        // Close on outside click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        };
    }

    function generateEmail() {
        const fromIdx = document.getElementById('mr-from').value;
        const toIdx = document.getElementById('mr-to').value;
        const pkgIdx = document.getElementById('mr-package').value;
        const po = document.getElementById('mr-po').value;
        const pickup = document.getElementById('mr-pickup').value;
        const dropoff = document.getElementById('mr-dropoff').value;
        const username = document.getElementById('mr-username').value;

        if (!po || !pickup || !dropoff || !username) {
            alert('Please fill in all fields');
            return;
        }

        localStorage.setItem('mr_username', username);

        const fromAddr = addresses[fromIdx];
        const toAddr = addresses[toIdx];
        const pkg = packages[pkgIdx];

        const tomorrow = getTomorrow();
        const dateInfo = formatDate(tomorrow);

        // Subject: Messenger Request [tomorrows week day] [tomorrows date formatted in M/D/Y] - [to address, short form]
        const subject = `Messenger Request ${dateInfo.dayName} ${dateInfo.dateFormatted} - ${toAddr.short}`;

        // Body Construction
        const body = `Hello,

I would like to schedule a pickup for tomorrow between ${pickup} - ${dropoff} at ${fromAddr.short} and delivery to ${toAddr.short}.

Package specs:
${pkg.description} PO ${po}

PICK UP – AFTER ${pickup}
${fromAddr.full}

DROP OFF – BEFORE ${dropoff}
${toAddr.full}

Please let me know if this is possible.

Thank you so much,
${username}

${dateInfo.dayNumber} ${dateInfo.monthAbbr} ${dateInfo.year} MESSENGER
Pickup : ${fromAddr.short} PO ${po}
Delivery : ${toAddr.short}
Via Active`;

        // Create Gmail Compose URL
        const params = new URLSearchParams();
        params.append('view', 'cm');
        params.append('fs', '1');
        params.append('to', RECIPIENTS.to);
        params.append('cc', RECIPIENTS.cc);
        params.append('su', subject);
        params.append('body', body);

        const url = `https://mail.google.com/mail/?${params.toString()}`;

        window.open(url, '_blank');
        document.getElementById('mr-modal-overlay').style.display = 'none';
    }

    function init() {
        console.log("Gmail Messenger Request: Init called");
        addStyles();
        showToast();
        createModal();

        // Create the button initially as a floating button
        let btn = document.getElementById('mr-trigger-btn');
        if (!btn) {
            btn = document.createElement('div');
            btn.id = 'mr-trigger-btn';
            btn.textContent = 'Messenger Request';
            btn.className = 'mr-trigger-btn mr-floating'; // Default to floating
            btn.onclick = () => {
                document.getElementById('mr-modal-overlay').style.display = 'flex';
            };
            document.body.appendChild(btn);
            console.log("Gmail Messenger Request: Floating button added");
        }

        // Try to find the real Compose button to move our button next to it
        const checkForCompose = () => {
            // Strategy 1: Look for the specific 'gh="cm"' attribute
            let composeBtn = document.querySelector('div[role="button"][gh="cm"]');

            // Strategy 2: Look for button with "Compose" text
            if (!composeBtn) {
                const buttons = Array.from(document.querySelectorAll('div[role="button"]'));
                composeBtn = buttons.find(el => el.innerText && el.innerText.trim() === 'Compose');
            }

            if (composeBtn) {
                // The user reported the button appearing to the right, which means the direct parent is a flex-row.
                // We want to go up one level to the sidebar column container.
                const composeWrapper = composeBtn.parentElement;
                const sidebar = composeWrapper ? composeWrapper.parentElement : null;

                if (sidebar) {
                    // Check if we are already in the sidebar
                    if (btn.parentElement === sidebar) return;

                    console.log("Gmail Messenger Request: Found Compose button wrapper, moving trigger button to sidebar");

                    // Switch to sidebar style
                    btn.className = 'mr-trigger-btn mr-sidebar';

                    // Insert after the compose wrapper to appear below it
                    if (composeWrapper.nextSibling) {
                        sidebar.insertBefore(btn, composeWrapper.nextSibling);
                    } else {
                        sidebar.appendChild(btn);
                    }
                }
            }
        };

        // Check every second
        setInterval(checkForCompose, 1000);
    }

    // Start immediately if body exists, otherwise wait
    if (document.body) {
        init();
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.body) {
                init();
                obs.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }

})();
