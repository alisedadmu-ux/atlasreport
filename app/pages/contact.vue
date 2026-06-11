<template>
  <div class="bg-[#f5f5f3] min-h-screen text-slate-950 font-sans p-4 md:p-10">
    <div class="max-w-4xl mx-auto bg-white border border-slate-200/60 shadow-[0_50px_100px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
      
      <div class="md:col-span-5 bg-slate-950 text-white p-8 md:p-12 flex flex-col justify-between space-y-12">
        <div class="space-y-4">
          <span class="text-[9px] font-black text-amber-400 tracking-[0.3em] uppercase">Secure Comms</span>
          <h2 class="text-3xl font-serif font-black tracking-tight leading-tight">Establish Contact Line</h2>
          <p class="text-xs text-slate-400 font-serif font-light leading-relaxed">
            Direct cryptographic transmission portals are open for editorial submissions, press alerts, and general technical inquiries.
          </p>
        </div>

        <div class="space-y-4 font-mono text-[10px] text-slate-500">
          <div>
            <p class="text-slate-400 uppercase font-bold tracking-wider">SECURE BROADCAST EMAIL</p>
            <p class="text-white text-xs pt-0.5">terminal@atlas.report</p>
          </div>
          <div>
            <p class="text-slate-400 uppercase font-bold tracking-wider">SIGNAL NODE ID</p>
            <p class="text-white text-xs pt-0.5">@atlas.intel.secure</p>
          </div>
        </div>
      </div>

      <div class="md:col-span-7 p-8 md:p-12 space-y-6 bg-white">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">Transmission Form</h3>
        
        <form @submit.prevent class="space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-700">Identity / Organization</label>
            <input type="text" placeholder="Anonymous Entity or Name" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-slate-950 font-serif" />
          </div>
          
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-700">Return Routing Address</label>
            <input type="email" placeholder="secure-routing@domain.com" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-slate-950 font-serif" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-700">Intelligence Payload / Message</label>
            <textarea rows="4" placeholder="Input full comprehensive statement or descriptive event briefing data parameters..." class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-slate-950 font-serif resize-none"></textarea>
          </div>

          <button class="w-full bg-slate-950 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-lg transition-colors shadow-md">
            Deploy Secure Transmission
          </button>
        </form>
      </div>

    </div>
  </div>
</template>