// JavaScript source code
const importObject = {
    my_namespace: {
        imported_func: arg => {
            idRes.innerHTML = arg;
        }
    }
};

let wasmInstanceExports;

WebAssembly.instantiateStreaming(fetch("simple.wasm"), importObject).then(
    (obj) => {
        const whatJsFunc = finalAnswer;
        idJsFuncType.value = typeof whatJsFunc; // response: `function`
        idJsFuncToString.value = whatJsFunc.toString(); // response: `function finalAnswer() {    wasmInstanceExports.exported_func_42();}`
        wasmInstanceExports = obj.instance.exports;
        const whatWasmFunc = wasmInstanceExports.exported_func_8;
        idWasmFuncType.value = typeof whatWasmFunc; // response: `function`
        idWasmFuncToString.value = whatWasmFunc.toString(); // response: `function 2() { [native code] }`
    }
);

function finalAnswer() {
    wasmInstanceExports.exported_func_42();
}

function howMuchTea() {
    wasmInstanceExports.exported_func_8();
}
