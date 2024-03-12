import jobsData from "./data.json" assert { type: 'json' };
const orgNode = document.querySelector('.card');
const tagNode = document.querySelector('.tag').cloneNode(false);
function updateJSON(){
  jobsData.jobs = jobsData.jobs.map(it => {
    it["tags"] = [it.role, it.level, ...it.languages, ...it.tools];
    return it;
  });
}
function card(Jdata, cpy){
  let temp = cpy.children;
  temp[0].src = Jdata.logo;
  temp[1].children[0].children[0].innerText = Jdata.company;
  if(Jdata.new){
    temp[1].children[0].children[1].style.visibility = "visible";
    temp[1].children[0].children[1].innerText = "NEW!";
  }
  else{
    temp[1].children[0].children[1].style.visibility = "hidden";
  }
  if(Jdata.featured){
    temp[1].children[0].children[2].style.visibility = "visible";
    temp[1].children[0].children[2].innerText = "FEATURED";
    cpy.id = "special";
  }
  else{
    temp[1].children[0].children[2].style.visibility = "hidden";
    cpy.id = "";
  }
  temp[1].children[1].innerText = Jdata.position;
  temp[1].children[2].children[0].children[0].innerText = Jdata.postedAt;
  temp[1].children[2].children[0].children[1].innerText = Jdata.contract;
  temp[1].children[2].children[0].children[2].innerText = Jdata.location;
  let n = 5 - Jdata.tags.length;
  let i = 0;
  let buttons = temp[2].children;
  while(i < n){
    buttons[i].style.display = "none";
    i++;
  }
  let k = 0;
  while(i < 5){
    buttons[i].style.display = "block";
    buttons[i].innerText = Jdata.tags[k];
    i++;
    k++;
  }
  return cpy;
} 
function removeChildrens(container){
  while(container.firstElementChild){
    container.removeChild(container.firstElementChild);
  }
}

function createCards(JdataArr){
  const container = document.querySelector('.container');
  removeChildrens(container);
  for(let it of JdataArr){
    let cpy = orgNode.cloneNode(true);
    cpy = card(it, cpy);
    container.append(cpy);
  }
  eventlis();
}
let filtered_arr = [];
function filtercontainer(filtered_arr){
  let filtered_Jdata = jobsData.jobs.filter(it => {
    let cpy = filtered_arr.filter(i => {
      if(it.tags.find(item => item == i)) return true;
      return false;
    });
    return cpy.length == filtered_arr.length;
  });
  createCards(filtered_Jdata);
}
function downContainer(){
  const container = document.querySelector(".container");
  container.style.marginTop = "2vh";
}
function upContainer(){
  const container = document.querySelector(".container");
  container.style.marginTop = "0";
}
function eventlistenersSearchbar(node){
  let clearBtn = node.lastElementChild;
  clearBtn.addEventListener('click', () =>{
    filtered_arr = [];
    removeChildrens(node);
    createCards(jobsData.jobs);
    node.style.visibility = "hidden";
    upContainer();
  });
  Array.from(node.children).forEach(it => {
    if(it != clearBtn){
      it.lastElementChild.addEventListener('click', (e) =>{
        filtered_arr = filtered_arr.filter(i => i != e.target.closest('div').firstElementChild.innerText);
        filtercontainer(filtered_arr);
        if(filtered_arr.length == 0){
          document.querySelector('#searchBar').style.visibility = "hidden";
          upContainer();
        }
        else{
          createSearchbar(filtered_arr);
        }
      });
    }
  })
}
function createSearchbar(filtered_arr){
  downContainer();
  let div = document.querySelector('#searchBar');
  div.style.visibility = "visible";
  removeChildrens(div);
  let clearBtn = document.createElement('button');
  clearBtn.id = "clearBtn";
  clearBtn.innerText = "Clear";
  for(let it of filtered_arr){
    let innerDiv = document.createElement('div');
    innerDiv.className = "innerDiv";
    let btn = document.createElement('button');
    btn.innerText = "X";
    btn.className = "X";
    let node = tagNode.cloneNode();
    node.style.borderRadius = "10px 0px 0px 10px";
    node.style.height = "38px";
    node.style.margin = "0px";
    node.innerText = it;
    innerDiv.append(node);
    innerDiv.append(btn);
    div.append(innerDiv);
  }
  div.append(clearBtn);
  eventlistenersSearchbar(div);
  // document.querySelector('body').insertBefore(div, document.querySelector('section'));
}

function eventlis(){
  const tags = Array.from(document.querySelectorAll('.tag'));
  tags.forEach(it => {
    it.addEventListener('click', (e)=>{
      if(filtered_arr.find(i => i == e.target.innerText) == undefined){
        filtered_arr.push(e.target.innerText);
        filtercontainer(filtered_arr);
        createSearchbar(filtered_arr);
      }
    });
  });
}
updateJSON();
// console.log(jobsData.jobs);
createCards(jobsData.jobs);