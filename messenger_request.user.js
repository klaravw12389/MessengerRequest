// ==UserScript==
// @name         Gmail Messenger Request
// @namespace    http://tampermonkey.net/
// @version      1.14
// @description  Adds a button to Gmail to compose a Messenger Request email
// @author       Antigravity
// @match        https://mail.google.com/*
// @updateURL    https://github.com/klaravw12389/MessengerRequest/raw/refs/heads/main/messenger_request.user.js
// @downloadURL  https://github.com/klaravw12389/MessengerRequest/raw/refs/heads/main/messenger_request.user.js
// @grant        none
// ==/UserScript==

// Embedded Data
window.MESSENGER_DATA = {
    "addresses": [
        {
            "name": "RH",
            "short": "80 Richards",
            "full": "APPARATUS Red Hook\nAttn: Receiving\n80 Richards Street, 4th FL\nBrooklyn, NY 11231\n347.246.4210 Ext 163"
        },
        {
            "name": "30TH",
            "short": "APPARATUS Studio 30th st",
            "full": "APPARATUS Studio\nAttn: Sam O'Brien\n124 West 30th Street\nNew York, NY 10001"
        },
        {
            "name": "Blacktable",
            "short": "Blacktable Studios",
            "full": "Blacktable Studio / NYC Laser Cut\nAttn: Fiona\n805 Rockaway Ave, Unit 5\nBrooklyn, NY 11212\nPhone:   (347) 335-0228"
        },
        {
            "name": "Metalworks",
            "short": "Metalworks",
            "full": "Attn: Michael\nMetalworks Inc., 1303 Herschell Street, \nBronx, NY, 10461\n212-695-3114"
        },
        {
            "name": "Continental Die",
            "short": "Continental Die",
            "full": "Continental Die\nAttn: Danny\n115 West 25th Street\nNew York, NY 10001\n212-242-0642"
        },
        {
            "name": "Libra",
            "short": "LIBRA LEATHER",
            "full": "LIBRA LEATHER/MITCH ALFUS\n285 Lafayette Street, unit 2B\nNew York NY 10012\n212-695-3114\n*Temporary Address*"
            //"full": "LIBRA LEATHER\nAttn: Valentina Taylor\n199 Lafayette Street, Unit 5D\nNew York, NY, 10012\n212-695-3114"
        },
        {
            "name": "NJWJ",
            "short": "New Jersey Waterjet",
            "full": "New Jersey Waterjet \nAttn: Larry\nNew Jersey Waterjet, 725 Lehigh Avenue\nUnit 4, Union, NJ,  07083\n732-910-1602"
        },
        {
            "name": "DSA",
            "short": "DSA Finishing",
            "full": "DSA FINISHING attn: Diego\n130-16 91st Avenue\nRichmond Hill, New York 11418\nUnited States\n(718) 821-2124"
        },
        {
            "name": "CL Precision",
            "short": "CL Precision",
            "full": "CL Precision\nAttn: George Lolis\n50-15 70th Street\nWoodside, NY 11377\nPhone:   718-651-8475"
        },
        {
            "name": "KLN",
            "short": "KLN Studio",
            "full": "KLN Studio\nAttn: Toby Newman\n79 Grattan Street\nBrooklyn, NY, 11237\n707.291.6159"
        }
    ],
    "packages": [
        {
            "name": "SEGMENT DINING TABLE TOP",
            "description": "SEGMENT DINING TABLE TOP:	107\" x 44\" x 7\",	~ 500 lbs,	QTY 1."
        },
        {
            "name": "SEGMENT CONSOLE TABLE TOP",
            "description": "SEGMENT CONSOLE TABLE TOP:	58\" x 17.5\" x 4.25\",	~ 75 lbs,	QTY 1."
        },
        {
            "name": "SEGMENT COFFEE TABLE TOP",
            "description": "SEGMENT COFFEE TABLE TOP:	52\" x 32\" x 4.625\",	~ 125 lbs,	QTY 1."
        },
        {
            "name": "SEGMENT OCCASIONAL TABLE TOP",
            "description": "SEGMENT OCCASIONAL TABLE TOP:	11\" x 13\" x 3\",	~5 lbs,	QTY 1."
        },
        {
            "name": "SEGMENT SIDE TABLE TOP",
            "description": "SEGMENT SIDE TABLE TOP:	22\" x 22\" x 4\",	~10 lbs,	QTY 1."
        },
        {
            "name": "SEGMENT DINING LEGS",
            "description": "SEGMENT DINING LEGS:	18\" x 30\" x 3\",	~ 80 lbs,	QTY 6."
        },
        {
            "name": "SEGMENT CONSOLE LEGS",
            "description": "SEGMENT CONSOLE LEGS:	18\" x 33\" x 3\",	~ 80 lbs,	QTY 6."
        },
        {
            "name": "SEGMENT COFFEE LEGS",
            "description": "SEGMENT COFFEE LEGS:	32\" x 15\" x 3\",	~ 80 lbs,	QTY 5."
        },
        {
            "name": "SEGMENT OCCASIONAL LEGS",
            "description": "SEGMENT OCCASIONAL LEGS:	11\" x 18\" x 3\",	~ 20 lbs,	QTY 5."
        },
        {
            "name": "SEGMENT SIDE LEGS",
            "description": "SEGMENT SIDE LEGS:	22\" x 19\" x 3\",	~ 40 lbs,	QTY 2."
        },
    ]
};

(function () {
    'use strict';

    // Embedded Data
    const DATA = window.MESSENGER_DATA || {
        "addresses": [],
        "packages": []
    };

    const SERVICES = {
        "Active": {
            email: "ordersforactive@gmail.com",
            name: "Active"
        },
        "OnSchedule": {
            email: "jgilde@onschedulemessenger.com",
            name: "OnSchedule"
        }
    };
    const CC_EMAILS = [
        "procurement@apparatusstudio.com",
        "jessica.soha@apparatusstudio.com",
        "jared.brosky@apparatusstudio.com",
        "shipping@apparatusstudio.com",
        "vance.cherebin@apparatusstudio.com",
        "receiving@apparatusstudio.com"
    ].join(",");

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        #mr-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: transparent; z-index: 10000; display: flex;
            justify-content: center; align-items: center;
            pointer-events: none;
        }
        #mr-modal {
            background: white; padding: 20px; border-radius: 8px;
            width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: sans-serif;
            z-index: 10001;
            pointer-events: auto;
        }
        #mr-modal h2 { margin-top: 0; cursor: move; }
        .mr-field { margin-bottom: 15px; }
        .mr-field label { display: block; margin-bottom: 5px; font-weight: bold; }
        .mr-field select, .mr-field input { width: 100%; padding: 8px; box-sizing: border-box; }
        .mr-buttons { display: flex; justify-content: flex-end; gap: 10px; }
        .mr-btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
        .mr-btn-primary { background: #1a73e8; color: white; }
        .mr-btn-secondary { background: #ddd; color: black; }
    `;
    document.head.appendChild(style);

    function createModal() {
        console.log('Messenger Request: createModal called');
        if (document.getElementById('mr-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'mr-modal-overlay';

        const modal = document.createElement('div');
        modal.id = 'mr-modal';

        const title = document.createElement('h2');
        title.innerText = 'Messenger Request';
        modal.appendChild(title);

        function createField(labelText, type, id, options = null, placeholder = '') {
            const div = document.createElement('div');
            div.className = 'mr-field';

            const label = document.createElement('label');
            label.innerText = labelText;
            div.appendChild(label);

            let input;
            if (type === 'select') {
                input = document.createElement('select');
                input.id = id;
                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.innerText = opt.text;
                    input.appendChild(option);
                });
            } else if (type === 'datalist') {
                input = document.createElement('input');
                input.id = id;
                input.setAttribute('list', id + '-list');
                const datalist = document.createElement('datalist');
                datalist.id = id + '-list';
                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    datalist.appendChild(option);
                });
                div.appendChild(datalist);
            } else {
                input = document.createElement('input');
                input.type = type; // Use the passed type (e.g., 'text' or 'date')
                input.id = id;
                if (placeholder) input.placeholder = placeholder;
            }
            div.appendChild(input);
            return div;
        }
        const addressOptions = DATA.addresses.map(a => ({ value: a.name, text: a.name }));
        const packageOptions = DATA.packages.map(p => ({ value: p.name, text: p.name }));
        const serviceOptions = Object.keys(SERVICES).map(s => ({ value: s, text: s }));

        // Date Options Generation
        // Default to next business day
        const today = new Date();
        let targetDate = new Date(today);
        targetDate.setDate(today.getDate() + 1); // Start with tomorrow

        // If Saturday (6), add 2 days -> Monday
        if (targetDate.getDay() === 6) {
            targetDate.setDate(targetDate.getDate() + 2);
        }
        // If Sunday (0), add 1 day -> Monday
        else if (targetDate.getDay() === 0) {
            targetDate.setDate(targetDate.getDate() + 1);
        }

        // Format to YYYY-MM-DD for input type="date"
        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dd = String(targetDate.getDate()).padStart(2, '0');
        const defaultDateValue = `${yyyy}-${mm}-${dd}`;

        modal.appendChild(createField('Messenger Service', 'select', 'mr-service', serviceOptions));

        // Add Date Picker
        const dateField = createField('Date', 'date', 'mr-date');
        // Select the default value
        dateField.querySelector('input').value = defaultDateValue;
        modal.appendChild(dateField);

        modal.appendChild(createField('From Address', 'select', 'mr-from', addressOptions));
        modal.appendChild(createField('To Address', 'select', 'mr-to', addressOptions));

        modal.appendChild(createField('Package', 'datalist', 'mr-package', packageOptions));

        const poField = createField('PO Number', 'text', 'mr-po', null, 'e.g. 12345');
        poField.querySelector('input').setAttribute('autocomplete', 'off');
        modal.appendChild(poField);

        // Default times set
        const timeContainer = document.createElement('div');
        timeContainer.style.display = 'flex';
        timeContainer.style.gap = '15px';

        const pickupField = createField('Pickup Time', 'text', 'mr-pickup', null, 'e.g. 10:00 AM');
        pickupField.querySelector('input').value = '10:00 AM';
        pickupField.style.flex = '1';
        timeContainer.appendChild(pickupField);

        const dropoffField = createField('Dropoff Time', 'text', 'mr-dropoff', null, 'e.g. 3:00 PM');
        dropoffField.querySelector('input').value = '3:00 PM';
        dropoffField.style.flex = '1';
        timeContainer.appendChild(dropoffField);

        modal.appendChild(timeContainer);

        const btnContainer = document.createElement('div');
        btnContainer.className = 'mr-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'mr-btn mr-btn-secondary';
        cancelBtn.innerText = 'Cancel';
        cancelBtn.onclick = () => overlay.remove();

        const createBtn = document.createElement('button');
        createBtn.className = 'mr-btn mr-btn-primary';
        createBtn.innerText = 'Create Email';
        createBtn.onclick = generateEmail;

        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(createBtn);
        modal.appendChild(btnContainer);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Drag functionality
        const header = modal.querySelector('h2');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener("mousedown", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("mousemove", drag);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header) {
                isDragging = true;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, modal);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }
    }

    function getUserName() {
        let detectedName = "Klara"; // Fallback
        try {
            const accountBtn = document.querySelector('a[aria-label^="Google Account:"]');
            if (accountBtn) {
                const ariaLabel = accountBtn.getAttribute('aria-label');
                // Format: "Google Account: Name (email)"
                // Extract Name
                const nameMatch = ariaLabel.match(/Google Account:\s+([^(]+)/);
                if (nameMatch && nameMatch[1]) {
                    const fullName = nameMatch[1].trim();
                    detectedName = fullName.split(' ')[0]; // First name
                }
            }
        } catch (e) {
            console.error('Messenger Request: Failed to detect user name', e);
        }
        return detectedName;
    }

    function generateEmail() {
        console.log('Messenger Request: generateEmail called');
        const serviceName = document.getElementById('mr-service').value;
        const userName = getUserName();
        const fromName = document.getElementById('mr-from').value;
        const toName = document.getElementById('mr-to').value;
        const packageName = document.getElementById('mr-package').value;
        const po = document.getElementById('mr-po').value;
        const pickup = document.getElementById('mr-pickup').value;
        const dropoff = document.getElementById('mr-dropoff').value;

        const fromAddr = DATA.addresses.find(a => a.name === fromName);
        const toAddr = DATA.addresses.find(a => a.name === toName);

        // Find package description if it matches a known package, otherwise use the input value
        const knownPkg = DATA.packages.find(p => p.name === packageName);
        const pkgDesc = knownPkg ? knownPkg.description : packageName;

        // Date Handling
        const selectedDateValue = document.getElementById('mr-date').value;
        // Parse YYYY-MM-DD manually to avoid UTC issues
        const [sYear, sMonth, sDay] = selectedDateValue.split('-').map(Number);
        const selectedDate = new Date(sYear, sMonth - 1, sDay);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        const dayName = days[selectedDate.getDay()];
        const monthName = months[selectedDate.getMonth()];
        const dateStr = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;
        const dateDayNum = selectedDate.getDate();
        const year = selectedDate.getFullYear();

        const now = new Date();
        const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffTime = selectedDate - todayZero;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        let pickupDateTextPlain;
        let pickupDateTextRich;

        if (diffDays === 0) {
            pickupDateTextPlain = 'today';
            pickupDateTextRich = 'today';
        } else if (diffDays === 1) {
            pickupDateTextPlain = 'tomorrow';
            pickupDateTextRich = 'tomorrow';
        } else {
            pickupDateTextPlain = `${dayName} ${dateStr}`;
            pickupDateTextRich = `${dayName} ${monthName} ${dateDayNum}`;
        }

        // Subject
        const subject = `Messenger Request ${dayName} ${dateStr} - ${fromAddr.short} to ${toAddr.short}`;

        // Body
        // const userName = "Klara" // Now dynamic

        // Create mailto link to trigger Gmail's internal docked compose window
        // We use a plain text body for the mailto link as a fallback and to initialize the window
        const service = SERVICES[serviceName];
        const toEmail = service.email;

        const bodyPlain = `Hello,

I would like to schedule a pickup for ${pickupDateTextPlain} between ${pickup} - ${dropoff} at ${fromAddr.short} and delivery to ${toAddr.short}.

Package specs:
${pkgDesc} PO ${po}

PICK UP – AFTER ${pickup}
${fromAddr.full}

DROP OFF – BEFORE ${dropoff}
${toAddr.full}

Please let me know if this is possible.

Thank you so much,
${userName}

${dateDayNum} ${monthName} ${year} MESSENGER
Pickup : ${fromAddr.short} PO ${po}
Delivery : ${toAddr.short}
Via ${service.name}`;

        const mailtoUrl = `mailto:${toEmail}?cc=${encodeURIComponent(CC_EMAILS)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyPlain)}`;

        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        document.getElementById('mr-modal-overlay').remove();

        const emailData = {
            pickup, dropoff, fromAddr, toAddr, pkgDesc, po, userName, dateDayNum, monthName, year, serviceName, dayName, pickupDateTextRich
        };

        waitForComposeAndInject(emailData);
    }

    function createRichBody(data) {
        const fragment = document.createDocumentFragment();

        const addText = (text) => fragment.appendChild(document.createTextNode(text));
        const addBold = (text) => {
            const b = document.createElement('b');
            b.innerText = text;
            fragment.appendChild(b);
        };
        const addBr = () => fragment.appendChild(document.createElement('br'));

        addText('Hello,');
        addBr(); addBr();

        addText('I would like to schedule a pickup for ');
        addText(`${data.pickupDateTextRich} between `)
        addText(`${data.pickup} - ${data.dropoff}`);
        addText(' at ');
        addBold(data.fromAddr.short);
        addText(' and delivery to ');
        addBold(data.toAddr.short);
        addText('.');
        addBr(); addBr();

        addText('Package specs:');
        addBr();
        addText(`${data.pkgDesc} PO `);
        addBold(data.po);
        addBr(); addBr();

        addBold('PICK UP – AFTER ');
        addBold(data.pickup);
        addBr();
        data.fromAddr.full.split('\n').forEach((line, i) => {
            if (i > 0) addBr();
            addText(line);
        });
        addBr(); addBr();

        addBold('DROP OFF – BEFORE ');
        addBold(data.dropoff);
        addBr();
        data.toAddr.full.split('\n').forEach((line, i) => {
            if (i > 0) addBr();
            addText(line);
        });
        addBr(); addBr();

        addText('Please let me know if this is possible.');
        addBr(); addBr();

        addText('Thank you so much,');
        addBr();
        addText(data.userName);
        addBr(); addBr();

        addBold(`${data.dateDayNum} ${data.monthName} ${data.year} MESSENGER`);
        addBr();
        addText(`Pickup : ${data.fromAddr.short} PO ${data.po}`);
        addBr();
        addText(`Delivery : ${data.toAddr.short}`);
        addBr();
        addText(`Via ${data.serviceName}`);

        return fragment;
    }

    function waitForComposeAndInject(data) {
        console.log('Messenger Request: Waiting for compose window...');
        const start = Date.now();
        const interval = setInterval(() => {
            // Stop after 15 seconds
            if (Date.now() - start > 15000) {
                clearInterval(interval);
                console.log('Messenger Request: Timed out waiting for compose window');
                return;
            }

            // Find the message body
            // Gmail uses div[aria-label="Message Body"] and role="textbox"
            // We also look for contenteditable="true" to be safe
            // We select the last one in case there are multiple, assuming the new one is last
            const bodies = document.querySelectorAll('div[aria-label="Message Body"], div[role="textbox"][contenteditable="true"]');

            // Filter for visible ones only to avoid hidden pre-loaded ones
            const visibleBodies = Array.from(bodies).filter(b => b.offsetParent !== null);

            const bodyElement = visibleBodies.length > 0 ? visibleBodies[visibleBodies.length - 1] : null;

            if (bodyElement) {
                // Check if we already injected
                if (bodyElement.getAttribute('data-mr-injected') === 'true') {
                    return;
                }

                // Wait for the plain text to be loaded by Gmail (from the mailto link)
                // This prevents us from injecting before Gmail has finished initializing the draft
                // RELAXED CHECK: Just check if it's not empty or if it has some content
                console.log('Messenger Request: Body text found:', bodyElement.innerText);

                if (bodyElement.innerText.trim().length === 0) {
                    // It might be truly empty or loading. Let's wait a bit more.
                    // But if it takes too long, we might want to just inject.
                    // For now, let's just proceed if we found the element and it's visible.
                }

                console.log('Messenger Request: Injecting DOM body');

                // Use DOM manipulation to bypass TrustedHTML issues
                try {
                    bodyElement.focus();
                    // Clear existing content safely
                    bodyElement.textContent = '';

                    // Create and append new content
                    const fragment = createRichBody(data);
                    bodyElement.appendChild(fragment);

                    console.log('Messenger Request: DOM injection success');
                } catch (e) {
                    console.error('Messenger Request: DOM injection failed', e);
                }

                bodyElement.setAttribute('data-mr-injected', 'true');

                clearInterval(interval);
            }
        }, 500);
    }

    function createButtonElement(isFixed = false) {
        const btn = document.createElement('div');
        btn.innerText = 'Messenger Request';
        btn.style.cursor = 'pointer';

        // Reverted Styles with Drop Shadow
        btn.style.backgroundColor = '#f2f2f2';
        btn.style.color = '#3c4043';
        btn.style.border = 'none';
        btn.style.borderRadius = '13px';
        btn.style.fontWeight = '500';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.fontFamily = "'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif";
        btn.style.fontSize = '14px';
        btn.style.lineHeight = '20px';
        btn.style.letterSpacing = '0.1px';

        // Add Drop Shadow
        btn.style.boxShadow = '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)';

        if (isFixed) {
            btn.id = 'mr-btn-fixed';
            btn.style.position = 'fixed';
            btn.style.bottom = '30px';
            btn.style.left = '30px';
            btn.style.zIndex = '9990';
            btn.style.padding = '16px 24px';
            btn.style.borderRadius = '28px'; // FAB style
            btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            btn.style.backgroundColor = 'white'; // Fixed button usually white
            btn.innerText = 'Messenger Request';
        } else {
            btn.id = 'mr-btn-trigger';
            btn.style.height = '45px';
            btn.style.padding = '0 24px';
            btn.style.margin = '0 0 16px 0';
            btn.style.width = 'fit-content';
        }

        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = '#e8eaed';
            btn.style.boxShadow = '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)'; // Stronger shadow on hover
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = isFixed ? 'white' : '#f2f2f2';
            btn.style.boxShadow = isFixed ? '0 4px 8px rgba(0,0,0,0.2)' : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)';
        });

        btn.addEventListener('click', function (e) {
            console.log('Messenger Request: Button clicked');
            e.preventDefault();
            e.stopPropagation();
            createModal();
        });
        return btn;
    }

    function addButton() {
        if (document.getElementById('mr-btn-trigger')) return;

        let injected = false;

        // Strategy: Find the button with text "Compose" more robustly
        // Look for div with role="button" containing "Compose" in text or aria-label
        const buttons = Array.from(document.querySelectorAll('div[role="button"]'));

        const composeBtn = buttons.find(b => {
            // Must be visible
            if (b.offsetParent === null) return false;

            const text = (b.innerText || '').trim();
            const label = (b.getAttribute('aria-label') || '').trim();

            // Check for English "Compose" in either text or accessible label
            return text.includes('Compose') || label.includes('Compose');
        });

        if (composeBtn) {
            console.log('Messenger Request: Found Compose button');

            // Attempt insertion logic
            const container = composeBtn.parentElement;
            if (container) {
                // Remove fixed button if it exists (in case we regained context)
                const fixedBtn = document.getElementById('mr-btn-fixed');
                if (fixedBtn) fixedBtn.remove();

                const btn = createButtonElement(false);

                // Create a wrapper to align it
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                // Adjust styling to try and match the sidebar alignment
                wrapper.style.paddingLeft = '13px';
                wrapper.style.marginTop = '22px';
                wrapper.appendChild(btn);

                // Insert after the parent container
                container.insertAdjacentElement('afterend', wrapper);
                injected = true;
            }
        }

        // Fallback: If inline injection failed/not possible, show fixed button
        if (!injected) {
            // Only add if not already present
            if (!document.getElementById('mr-btn-fixed')) {
                console.log('Messenger Request: Inline button failed, using fixed button fallback');
                const fixedBtn = createButtonElement(true);
                document.body.appendChild(fixedBtn);
            }
        }
    }

    // Observer to handle dynamic loading
    const observer = new MutationObserver((mutations) => {
        addButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check
    setTimeout(addButton, 1000);
    setTimeout(addButton, 3000);
    setTimeout(addButton, 5000);

})();
