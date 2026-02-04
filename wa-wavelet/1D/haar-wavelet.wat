(module
    (memory (import "js" "mem") 1)
	;; Create and export an wasm memory
	(memory $image 100)
	(export "image" (memory $image))
	(memory $xform 100)
	(export "xform" (memory $xform))

	(;func (export "dwt_forward")  (param $len i32) (result i32)
        (local $ptr i32)
        (local $end i32)
        (local $sum i32)
        (local.set $ptr (i32.const 0))
        (local.set $end (i32.mul (local.get $len) (i32.const 4) ) )
        (block $break
          (loop $top
            (br_if $break
              (i32.eq
                (local.get $ptr)
                (local.get $end)))
            (local.set $sum
              (i32.add
              (local.get $sum)
              (i32.load
                (local.get $ptr))))
            (local.set $ptr
              (i32.add
                (local.get $ptr)
                (i32.const 4)))
            (br $top)
        )
      )
      (local.get $sum)
	;)
	(func (export "dwt_forward")  (param $len i32) (param $level i32)
        (local $end i32)
        (local $ptr i32)
        (local $ptrnext i32)
        (local $sum i32)
        (local $tmp i32)
        (local.set $ptr (i32.const 0))
        (local.set $end (i32.mul (local.get $len) (i32.const 4) ) )
        (block $break
            (loop $top
                (br_if $break (i32.eq (local.get $ptr) (local.get $end)))
                (local.set $ptrnext (i32.add (local.get $ptr) (i32.const 4)))
                (local.get $ptr)
                (i32.add (i32.load (local.get $ptr)) (i32.load (local.get $ptrnext)) )
                (i32.store (local.get $ptrnext) (i32.sub (i32.load (local.get $ptr)) (i32.load (local.get $ptrnext)) ) )
                (i32.store)
                (local.set $ptr (i32.add (local.get $ptrnext) (i32.const 4)))
                (br $top)
            )
        )
	)
	(func (export "dwt_inverse") ;;(result i64) 
		return
	)
)