import getData from '@modules/api'

function init(data){
    console.log(data);
}

getData('summary').then(data => init(data));
