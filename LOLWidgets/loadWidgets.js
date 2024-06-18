const localFolder = "localFolder";
const LOCAL = new URL(import.meta.url).searchParams.get(localFolder)
console.log('url:', import.meta.url.replace(getLastUrlSegment(import.meta.url), ""))
sessionStorage.removeItem(localFolder)

if (LOCAL) {
    sessionStorage.setItem(localFolder, LOCAL)
}
const url = `${import.meta.url.replace(getLastUrlSegment(import.meta.url), "")}`
const urlLoadWidgets = LOCAL ? `${LOCAL}loadWidgets.json?_=${Date.now()}` : `${url}loadWidgets.json?_=${Date.now()}`

console.log('addWidgets:', url, 'urlLoadWidgets', urlLoadWidgets)
fetch(urlLoadWidgets)
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        addWidgets(data)
    });

const addWidgets = (data) => {

    console.log('addWidgets', data)
    data.files.forEach((item) => {
        console.log('item', item)
        let script = document.createElement(item.tag);
        let property = item.property
        for (let key in property) {
            console.log('key', key, 'property', property[key], data.mode)
            // script[key] = (key=="src" || key=="href")?`${property[key]}?_=${data.version}`:property[key]
            // if(data.mode == "development"){
            //     script[key] =(key=="src")? `../${property[key]}` : property[key]
            // }else if(key=="src"){
            //     script[key] = (key=="src" && LOCAL)? `${LOCAL}/${property[key]}`: `${url}${property[key]}`
            // }else{
            //     script[key] = property[key]
            // }

            if (key == "src") {
               // script[key] =  `${url}${property[key]}`
                script[key] = (LOCAL)? `${LOCAL}${property[key]}`: `${url}${property[key]}`
            }
            if (key != "src") {
                script[key] = property[key]
            }
        }
        var s = document.getElementsByTagName('script')[0];

        script.addEventListener("error", function () {
            console.error("ERROR LOAD SCRIPT")

        });
        script.addEventListener("abort", function () {
            console.error("ABORT LOAD SCRIPT")

        });
        s.parentNode.insertBefore(script, s);
    })

}

function getLastUrlSegment(url) {
    return new URL(url).pathname.split('/').filter(Boolean).pop();
}