import { motion } from "framer-motion"

export default function FloatingBackground(){

return (

<div className="floating-bg">

<motion.div
className="bubble bubble1"
animate={{ y:[0,-40,0], x:[0,20,0] }}
transition={{ duration:12, repeat:Infinity }}
/>

<motion.div
className="bubble bubble2"
animate={{ y:[0,50,0], x:[0,-20,0] }}
transition={{ duration:15, repeat:Infinity }}
/>

<motion.div
className="bubble bubble3"
animate={{ y:[0,-30,0], x:[0,30,0] }}
transition={{ duration:18, repeat:Infinity }}
/>

<motion.div
className="bubble bubble4"
animate={{ y:[0,60,0], x:[0,-30,0] }}
transition={{ duration:20, repeat:Infinity }}
/>

</div>

)
}