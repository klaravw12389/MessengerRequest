// ==UserScript==
// @name         Gmail Messenger Request
// @namespace    http://tampermonkey.net/
// @version      1.22
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
            "full": "DSA FINISHING\nattn: Diego\n130-16 91st Avenue\nRichmond Hill, New York 11418\nUnited States\n(718) 821-2124\nask for box and pictures!"
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
        },
        {
            "name": "Baikal",
            "short": "Baikal",
            "full": "Baikal Manufacturing\nattn: Mayang and Josef\n7 West 36th St 3rd FL\nNew York, NY 10018\n212-239-4650"
        },
        {
            "name": "EMPIRE METAL",
            "short": "EMPIRE METAL",
            "full": "EMPIRE METAL\nattn: Vinny Giaccone\n24-69 46TH ST\nASTORIA NY 11103\n718.545.6700"
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

        // Helper to add custom address logic
        function addCustomAddressBehavior(fieldDiv, selectId, customId) {
            const container = document.createElement('div');
            container.style.display = 'none';
            container.style.marginTop = '5px';

            const textarea = document.createElement('textarea');
            textarea.id = customId;
            textarea.placeholder = "Enter Address:\nName\nStreet\nCity, State Zip\nPhone";
            textarea.style.width = '100%';
            textarea.style.boxSizing = 'border-box';
            textarea.rows = 4;
            textarea.style.fontFamily = 'inherit';

            const backBtn = document.createElement('a');
            backBtn.href = '#';
            backBtn.innerText = '← Back to address list';
            backBtn.style.display = 'block';
            backBtn.style.marginTop = '4px';
            backBtn.style.fontSize = '12px';
            backBtn.style.color = '#1a73e8';
            backBtn.style.textDecoration = 'none';

            backBtn.onclick = (e) => {
                e.preventDefault();
                container.style.display = 'none';
                select.style.display = 'block';
                select.value = select.options[0].value;
            };

            container.appendChild(textarea);
            container.appendChild(backBtn);
            fieldDiv.appendChild(container);

            const select = fieldDiv.querySelector('select');
            select.addEventListener('change', () => {
                if (select.value === 'Other') {
                    select.style.display = 'none';
                    container.style.display = 'block';
                    textarea.focus();
                }
            });
        }

        const addressOptions = DATA.addresses.map(a => ({ value: a.name, text: a.name }));
        addressOptions.push({ value: 'Other', text: 'Other' });

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

        const fromField = createField('From Address', 'select', 'mr-from', addressOptions);
        addCustomAddressBehavior(fromField, 'mr-from', 'mr-from-custom');
        modal.appendChild(fromField);

        const toField = createField('To Address', 'select', 'mr-to', addressOptions);
        addCustomAddressBehavior(toField, 'mr-to', 'mr-to-custom');
        modal.appendChild(toField);

        // Stop 2 Field (initially hidden)
        const stop2Field = createField('Stop 2', 'select', 'mr-stop2', addressOptions);
        stop2Field.style.display = 'none';
        addCustomAddressBehavior(stop2Field, 'mr-stop2', 'mr-stop2-custom');
        modal.appendChild(stop2Field);

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

        // Checkbox Container
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.gap = '20px'; // Space between the two options
        checkboxContainer.className = 'mr-field';

        // Round Trip Checkbox
        const roundTripDiv = document.createElement('div');
        // roundTripDiv.className = 'mr-field'; // Remove class to avoid bottom margin acting weird in flex
        roundTripDiv.style.display = 'flex';
        roundTripDiv.style.alignItems = 'center';
        roundTripDiv.style.cursor = 'pointer';
        roundTripDiv.style.marginLeft = '8px';

        const roundTripCheckbox = document.createElement('input');
        roundTripCheckbox.type = 'checkbox';
        roundTripCheckbox.id = 'mr-round-trip';
        roundTripCheckbox.style.width = 'auto';
        roundTripCheckbox.style.marginRight = '10px';
        roundTripCheckbox.style.transform = 'scale(1.5)';
        roundTripCheckbox.style.cursor = 'pointer';

        const roundTripLabel = document.createElement('label');
        roundTripLabel.innerText = 'Round Trip';
        roundTripLabel.setAttribute('for', 'mr-round-trip');
        roundTripLabel.style.marginBottom = '0';
        roundTripLabel.style.cursor = 'pointer';
        roundTripLabel.style.fontSize = '16px';

        roundTripDiv.appendChild(roundTripCheckbox);
        roundTripDiv.appendChild(roundTripLabel);

        // Multi-Stop Checkbox
        const multiStopDiv = document.createElement('div');
        // multiStopDiv.className = 'mr-field';
        multiStopDiv.style.display = 'flex';
        multiStopDiv.style.alignItems = 'center';
        multiStopDiv.style.cursor = 'pointer';
        // multiStopDiv.style.marginLeft = '8px'; // Remove individual margin if they are in a flex container

        const multiStopCheckbox = document.createElement('input');
        multiStopCheckbox.type = 'checkbox';
        multiStopCheckbox.id = 'mr-multi-stop';
        multiStopCheckbox.style.width = 'auto';
        multiStopCheckbox.style.marginRight = '10px';
        multiStopCheckbox.style.transform = 'scale(1.5)';
        multiStopCheckbox.style.cursor = 'pointer';

        const multiStopLabel = document.createElement('label');
        multiStopLabel.innerText = 'Multi-Stop';
        multiStopLabel.setAttribute('for', 'mr-multi-stop');
        multiStopLabel.style.marginBottom = '0';
        multiStopLabel.style.cursor = 'pointer';
        multiStopLabel.style.fontSize = '16px';

        multiStopDiv.appendChild(multiStopCheckbox);
        multiStopDiv.appendChild(multiStopLabel);

        checkboxContainer.appendChild(roundTripDiv);
        checkboxContainer.appendChild(multiStopDiv);

        modal.appendChild(checkboxContainer);

        // Multi-Stop Logic
        multiStopCheckbox.addEventListener('change', () => {
            const toLabel = toField.querySelector('label');
            if (multiStopCheckbox.checked) {
                stop2Field.style.display = 'block';
                toLabel.innerText = 'Stop 1';
            } else {
                stop2Field.style.display = 'none';
                toLabel.innerText = 'To Address';
            }
        });

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
        const poSuffix = po ? ` PO ${po}` : '';
        const pickup = document.getElementById('mr-pickup').value;
        const dropoff = document.getElementById('mr-dropoff').value;

        const isRoundTrip = document.getElementById('mr-round-trip').checked;
        const isMultiStop = document.getElementById('mr-multi-stop').checked;

        let fromAddr;
        if (fromName === 'Other') {
            const customText = document.getElementById('mr-from-custom').value;
            const lines = customText.split('\n').filter(l => l.trim().length > 0);
            fromAddr = {
                name: 'Other',
                short: lines.length > 0 ? lines[0] : 'Custom Location',
                full: customText
            };
        } else {
            fromAddr = DATA.addresses.find(a => a.name === fromName);
        }

        let toAddr;
        if (toName === 'Other') {
            const customText = document.getElementById('mr-to-custom').value;
            const lines = customText.split('\n').filter(l => l.trim().length > 0);
            toAddr = {
                name: 'Other',
                short: lines.length > 0 ? lines[0] : 'Custom Location',
                full: customText
            };
        } else {
            toAddr = DATA.addresses.find(a => a.name === toName);
        }

        let stop2Addr = null;
        if (isMultiStop) {
            const stop2Name = document.getElementById('mr-stop2').value;
            if (stop2Name === 'Other') {
                const customText = document.getElementById('mr-stop2-custom').value;
                const lines = customText.split('\n').filter(l => l.trim().length > 0);
                stop2Addr = {
                    name: 'Other',
                    short: lines.length > 0 ? lines[0] : 'Custom Location',
                    full: customText
                };
            } else {
                stop2Addr = DATA.addresses.find(a => a.name === stop2Name);
            }
        }

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
        const subject = `Messenger Request ${dayName} ${dateStr} - ${fromAddr.short} to ${toAddr.short}${isMultiStop ? ' to ' + stop2Addr.short : ''}${isRoundTrip ? ' Round Trip' : ''}`;

        // Body
        // const userName = "Klara" // Now dynamic

        // Create mailto link to trigger Gmail's internal docked compose window
        // We use a plain text body for the mailto link as a fallback and to initialize the window
        const service = SERVICES[serviceName];
        const toEmail = service.email;

        let bodyPlain;

        if (isRoundTrip && isMultiStop) {
            bodyPlain = `Hello,

I would like to schedule a multi-stop round trip pickup for ${pickupDateTextPlain} between ${pickup} - ${dropoff} starting at ${fromAddr.short}, going to ${toAddr.short}, then to ${stop2Addr.short}, and returning to ${fromAddr.short}.

Package specs:
${pkgDesc}${poSuffix}

PICK UP – AFTER ${pickup}
${fromAddr.full}

STOP 1
${toAddr.full}

STOP 2
${stop2Addr.full}

DROP OFF – BEFORE ${dropoff}
${fromAddr.full}

Please let me know if this is possible.

Thank you so much,
${userName}

${dateDayNum} ${monthName} ${year} MESSENGER
Pickup : ${fromAddr.short}${poSuffix}
Stop 1 : ${toAddr.short}
Stop 2 : ${stop2Addr.short}
Dropoff : ${fromAddr.short}
Via ${service.name}`;

        } else if (isRoundTrip) {
            bodyPlain = `Hello,

I would like to schedule a round trip pickup for ${pickupDateTextPlain} between ${pickup} - ${dropoff} starting at ${fromAddr.short}, going to ${toAddr.short}, and returning to ${fromAddr.short}.

Package specs:
${pkgDesc}${poSuffix}

PICK UP – AFTER ${pickup}
${fromAddr.full}

PICK UP / DROP OFF
${toAddr.full}

DROP OFF – BEFORE ${dropoff}
${fromAddr.full}

Please let me know if this is possible.

Thank you so much,
${userName}

${dateDayNum} ${monthName} ${year} MESSENGER
Pickup : ${fromAddr.short}${poSuffix}
Stop : ${toAddr.short}
Dropoff : ${fromAddr.short}
Via ${service.name}`;

        } else if (isMultiStop) {
            bodyPlain = `Hello,

I would like to schedule a multi-stop pickup for ${pickupDateTextPlain} between ${pickup} - ${dropoff} starting at ${fromAddr.short}, going to ${toAddr.short}, and ending at ${stop2Addr.short}.

Package specs:
${pkgDesc}${poSuffix}

PICK UP – AFTER ${pickup}
${fromAddr.full}

STOP 1
${toAddr.full}

DROP OFF – BEFORE ${dropoff}
${stop2Addr.full}

Please let me know if this is possible.

Thank you so much,
${userName}

${dateDayNum} ${monthName} ${year} MESSENGER
Pickup : ${fromAddr.short}${poSuffix}
Stop 1 : ${toAddr.short}
Delivery : ${stop2Addr.short}
Via ${service.name}`;

        } else {
            bodyPlain = `Hello,

I would like to schedule a pickup for ${pickupDateTextPlain} between ${pickup} - ${dropoff} at ${fromAddr.short} and delivery to ${toAddr.short}.

Package specs:
${pkgDesc}${poSuffix}

PICK UP – AFTER ${pickup}
${fromAddr.full}

DROP OFF – BEFORE ${dropoff}
${toAddr.full}

Please let me know if this is possible.

Thank you so much,
${userName}

${dateDayNum} ${monthName} ${year} MESSENGER
Pickup : ${fromAddr.short}${poSuffix}
Delivery : ${toAddr.short}
Via ${service.name}`;
        }

        const mailtoUrl = `mailto:${toEmail}?cc=${encodeURIComponent(CC_EMAILS)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyPlain)}`;

        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        document.getElementById('mr-modal-overlay').remove();

        const emailData = {
            pickup, dropoff, fromAddr, toAddr, stop2Addr, pkgDesc, po, userName, dateDayNum, monthName, year, serviceName, dayName, pickupDateTextRich, isRoundTrip, isMultiStop
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

        if (data.isRoundTrip && data.isMultiStop) {
            addText('I would like to schedule a multi-stop round trip pickup for ');
            addText(`${data.pickupDateTextRich} between `)
            addText(`${data.pickup} - ${data.dropoff}`);
            addText(' starting at ');
            addBold(data.fromAddr.short);
            addText(', going to ');
            addBold(data.toAddr.short);
            addText(', then to ');
            addBold(data.stop2Addr.short);
            addText(', and returning to ');
            addBold(data.fromAddr.short);
            addText('.');

        } else if (data.isRoundTrip) {
            addText('I would like to schedule a round trip pickup for ');
            addText(`${data.pickupDateTextRich} between `)
            addText(`${data.pickup} - ${data.dropoff}`);
            addText(' starting at ');
            addBold(data.fromAddr.short);
            addText(', going to ');
            addBold(data.toAddr.short);
            addText(', and returning to ');
            addBold(data.fromAddr.short);
            addText('.');
        } else if (data.isMultiStop) {
            addText('I would like to schedule a multi-stop pickup for ');
            addText(`${data.pickupDateTextRich} between `)
            addText(`${data.pickup} - ${data.dropoff}`);
            addText(' starting at ');
            addBold(data.fromAddr.short);
            addText(', going to ');
            addBold(data.toAddr.short);
            addText(', and ending at ');
            addBold(data.stop2Addr.short);
            addText('.');
        } else {
            addText('I would like to schedule a pickup for ');
            addText(`${data.pickupDateTextRich} between `)
            addText(`${data.pickup} - ${data.dropoff}`);
            addText(' at ');
            addBold(data.fromAddr.short);
            addText(' and delivery to ');
            addBold(data.toAddr.short);
            addText('.');
        }
        addBr(); addBr();

        addText('Package specs:');
        addBr();
        addText(data.pkgDesc);
        if (data.po) {
            addText(' PO ');
            addBold(data.po);
        }
        addBr(); addBr();

        if (data.isRoundTrip && data.isMultiStop) {
            addBold('PICK UP – AFTER ');
            addBold(data.pickup);
            addBr();
            data.fromAddr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });
            addBr(); addBr();

            addBold('STOP 1');
            addBr();
            data.toAddr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });
            addBr(); addBr();

            addBold('STOP 2');
            addBr();
            data.stop2Addr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });
            addBr(); addBr();

            addBold('DROP OFF – BEFORE ');
            addBold(data.dropoff);
            addBr();
            data.fromAddr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });

        } else if (data.isRoundTrip) {
            addBold('PICK UP – AFTER ');
            addBold(data.pickup);
            addBr();
            data.fromAddr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });
            addBr(); addBr();

            addBold('PICK UP / DROP OFF');
            addBr();
            data.toAddr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });
            addBr(); addBr();

            addBold('DROP OFF – BEFORE ');
            addBold(data.dropoff);
            addBr();
            data.fromAddr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });

        } else if (data.isMultiStop) {
            addBold('PICK UP – AFTER ');
            addBold(data.pickup);
            addBr();
            data.fromAddr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });
            addBr(); addBr();

            addBold('STOP 1');
            addBr();
            data.toAddr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });
            addBr(); addBr();

            addBold('DROP OFF – BEFORE ');
            addBold(data.dropoff);
            addBr();
            data.stop2Addr.full.split('\n').forEach((line, i) => {
                if (i > 0) addBr();
                addText(line);
            });

        } else {
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
        }
        addBr(); addBr();

        addText('Please let me know if this is possible.');
        addBr(); addBr();

        addText('Thank you so much,');
        addBr();
        addText(data.userName);
        addBr(); addBr();

        addBold(`${data.dateDayNum} ${data.monthName} ${data.year} MESSENGER`);
        addBr();
        addText(`Pickup : ${data.fromAddr.short}${data.po ? ' PO ' + data.po : ''}`);
        addBr();
        if (data.isRoundTrip && data.isMultiStop) {
            addText(`Stop 1 : ${data.toAddr.short}`);
            addBr();
            addText(`Stop 2 : ${data.stop2Addr.short}`);
            addBr();
            addText(`Dropoff : ${data.fromAddr.short}`);
        } else if (data.isRoundTrip) {
            addText(`Stop : ${data.toAddr.short}`);
            addBr();
            addText(`Dropoff : ${data.fromAddr.short}`);
        } else if (data.isMultiStop) {
            addText(`Stop 1 : ${data.toAddr.short}`);
            addBr();
            addText(`Delivery : ${data.stop2Addr.short}`);
        } else {
            addText(`Delivery : ${data.toAddr.short}`);
        }
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
        // if (!injected) {
        //     // Only add if not already present
        //     if (!document.getElementById('mr-btn-fixed')) {
        //         console.log('Messenger Request: Inline button failed, using fixed button fallback');
        //         const fixedBtn = createButtonElement(true);
        //         document.body.appendChild(fixedBtn);
        //     }
        // }
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
