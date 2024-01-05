//let test = document.querySelectorAll(".artistIcon");
let test = document.getElementById('container');


function toggleTest(e){
    
    if(e.target !== e.currentTarget){
        const parent = e.target.parentNode;
        parent.classList.toggle('testStyle');
    }
}

/*
test.forEach(function(image){
    var img = image.querySelector('img');
    img.addEventListener('click', toggleTest);
})
*/

test.addEventListener('click', toggleTest, false);