const DEFAULT_TEXT = `Hi, this is ${'${sender}'} from the Living Trust Seminar. I am texting to confirm your attendance for the seminar over at ${'${item.Venue}'} in ${'${item.Location}'} at ${'${item.Time}'} tomorrow. ${'${item.Host}'} will be your seminar host and looks forward to meeting you! Can you please confirm that you'll be able to attend?`;

let data = [];
let isLocked = true;

function toggleLock() {
    const area = document.getElementById('scriptTemplate');
    const btn = document.getElementById('lockBtn');
    isLocked = !isLocked;
    area.readOnly = isLocked;
    btn.innerText = isLocked ? "Unlock Script" : "Lock Script";
}

function resetScript() {
    document.getElementById('scriptTemplate').value = DEFAULT_TEXT;
}

function addObject() {
    data.push([
        {key:'Venue', value:''},
        {key:'Location', value:''},
        {key:'Time', value:''},
        {key:'Host', value:''}
    ]);
    render();
}

function removeObject(i) { data.splice(i, 1); render(); }
function addProperty(i) { data[i].push({key:'', value:''}); render(); }
function removeProperty(o, p) { data[o].splice(p, 1); render(); }
function update(o, p, field, val) { data[o][p][field] = val; }

function render() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    data.forEach((obj, oIdx) => {
        const div = document.createElement('div');
        div.className = 'object-box';
        div.innerHTML = `<button onclick="removeObject(${oIdx})" style="float:right; border:none; background:none; color:red; cursor:pointer;">Remove Object</button><h4>Entry ${oIdx + 1}</h4>`;
        
        obj.forEach((prop, pIdx) => {
            const row = document.createElement('div');
            row.className = 'property-row';
            const keyInp = document.createElement('input');
            keyInp.value = prop.key;
            keyInp.placeholder = 'Key';
            keyInp.oninput = (e) => update(oIdx, pIdx, 'key', e.target.value);
            
            const valInp = document.createElement('input');
            valInp.value = prop.value;
            valInp.placeholder = 'Value';
            valInp.oninput = (e) => update(oIdx, pIdx, 'value', e.target.value);
            
            const delBtn = document.createElement('button');
            delBtn.innerText = 'X';
            delBtn.className = 'btn-remove';
            delBtn.onclick = () => removeProperty(oIdx, pIdx);
            
            row.append(keyInp, valInp, delBtn);
            div.appendChild(row);
        });
        const addP = document.createElement('button');
        addP.innerText = '+ Add Property';
        addP.onclick = () => addProperty(oIdx);
        div.appendChild(addP);
        app.appendChild(div);
    });
}

function generateMessages() {
    const sender = document.getElementById('senderName').value;
    const template = document.getElementById('scriptTemplate').value;
    const output = document.getElementById('output');
    output.innerHTML = '<h3>Generated Messages:</h3>';

    data.forEach(obj => {
        let item = {};
        obj.forEach(p => { if(p.key) item[p.key] = p.value; });
        
        let msg = template.replace(/\$\{sender\}/g, sender);
        msg = msg.replace(/\$\{item\.(.*?)\}/g, (match, key) => item[key] || `[${key}]`);
        
        const card = document.createElement('div');
        card.className = 'msg-card';
        const title = `${item.Venue || 'Venue'} ${item.Location || 'Location'} ${item.Time || 'Time'}`;
        card.innerHTML = `<strong>${title}</strong><p style="white-space:pre-wrap;">${msg}</p>`;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-copy';
        copyBtn.innerText = 'Copy Message';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(msg);
/*             alert("Message copied!"); */
        };
        card.appendChild(copyBtn);
        output.appendChild(card);
    });
}

addObject();
