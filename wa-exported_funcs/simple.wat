(module
  (func $i (import "my_namespace" "imported_func") (param i32))
  (func (export "exported_func_42")
    i32.const 42
    call $i
  )
  (func (export "exported_func_8")
    i32.const 8
    call $i
  )
)