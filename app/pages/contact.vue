<script setup>
import { ref } from 'vue'

const form = ref({
  operatorId: 'USR_//' + Math.floor(1000 + Math.random() * 9000),
  subject: '',
  payload: ''
})

const transmitSecurePayload = () => {
  if (!form.value.subject || !form.value.payload) {
    alert('CRITICAL_ERROR: All terminal validation fields must be populated.')
    return
  }
  
  alert(`UPLINK SUCCESSFUL\n\nOperator: ${form.value.operatorId}\nSignal sent safely through secure data channels.`);
  form.value.subject = ''
  form.value.payload = ''
}
</script>

<template>
  <main class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-10 px-4 sm:px-6">
    <div class="max-w-2xl mx-auto space-y-8">
      
      <div class="border-b border-slate-900 pb-6">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse"></span>
          <span class="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest font-bold">Secure Communications Array</span>
        </div>
        <h1 class="text-3xl font-black text-white tracking-tight">TRANSMIT_UPLINK</h1>
      </div>

      <div class="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 space-y-4 backdrop-blur-sm shadow-2xl">
        
        <div class="space-y-1.5 font-mono text-xs">
          <label class="text-slate-500 font-bold block uppercase tracking-wider">// Assign Transmitter Signature</label>
          <input 
            v-model="form.operatorId" 
            type="text" 
            readonly 
            class="w-full bg-black/40 border border-slate-900 rounded-xl px-4 py-2.5 text-slate-400 focus:outline-none select-none cursor-not-allowed"
          />
        </div>

        <div class="space-y-1.5 font-mono text-xs">
          <label class="text-slate-400 font-bold block uppercase tracking-wider">// Vector Subject Input</label>
          <input 
            v-model="form.subject" 
            type="text" 
            placeholder="Specify technical department target..." 
            class="w-full bg-black/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
        </div>

        <div class="space-y-1.5 font-mono text-xs">
          <label class="text-slate-400 font-bold block uppercase tracking-wider">// Encrypted Data Payload</label>
          <textarea 
            v-model="form.payload" 
            rows="5"
            placeholder="Write transmission brief strings here..." 
            class="w-full bg-black/50 border border-slate-800/80 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans text-sm resize-none"
          ></textarea>
        </div>

        <button 
          @click="transmitSecurePayload"
          class="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-mono text-xs uppercase font-bold tracking-widest text-white py-3 rounded-xl transition-all shadow-lg shadow-violet-500/10 active:scale-[0.99]"
        >
          EXECUTE_SIGNAL_TRANSMISSION_//
        </button>

      </div>

    </div>
  </main>
</template>