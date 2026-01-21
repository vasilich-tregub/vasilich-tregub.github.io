(module
	;; Create and export an wasm memory
	(memory $tapepos 1)
	(export "tapepos" (memory $tapepos))
	(memory $ruleArr 1)
	(export "waTMruleArr" (memory $ruleArr))
	(memory $ruleScrArr 1)
	(export "waTMruleScrArr" (memory $ruleScrArr))
	(memory $ruleBidirArr 1)
	(export "waTMruleBidirArr" (memory $ruleBidirArr))
	(memory $ruleStateArr 1)
	(export "waTMruleStateArr" (memory $ruleStateArr))

  	(export "startWaTM" (func $startWaTM))
	(func $startWaTM (param $var0 i32)	
		(local $POS i32)
		(local $tmrule i32)
		(local $ruleix i32) ;; rule index = ('[A..H]' - 'A')
		(local.set $POS (i32.const 32768))
		(local.set $tmrule (local.get $var0))

		(loop $nextinstr
		(local.set $ruleix (i32.rotl (local.get $tmrule) (i32.const 3))) ;; ruleix offset in bytes (x4) and (x2) as state contains two rules
		(i32.load8_u (memory $tapepos) (local.get $POS))
		(if 
			(then
				(local.set $ruleix (i32.add (local.get $ruleix) (i32.const 4)))
			)			
			(else)
		)
		(local.set $tmrule (i32.load (memory $ruleStateArr) (local.get $ruleix))) ;; set next-rule part of the instruction word
		(local.get $POS)		
		(i32.load (memory $ruleScrArr) (local.get $ruleix))
		(i32.store8 (memory $tapepos))
		(local.get $POS)
		(i32.load (memory $ruleBidirArr) (local.get $ruleix))
		(i32.add)
		(local.set $POS)
		(i32.ne (local.get $tmrule) (i32.const 7))
		(br_if $nextinstr)
		)
	)
)