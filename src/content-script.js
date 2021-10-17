const element = document.createElement('button');
element.style = 'position: absolute; top: 0; height: 0; z-index: 999; width: 100px; height: 100px';
element.innerText = '눌러봐!';

element.onclick = () => alert('안녕');

document.body.prepend(element);
