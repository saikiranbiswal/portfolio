if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    try{
      const registrations=await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.filter(registration=>registration.scope.includes('/portfolio/apps/papercraft/')).map(registration=>registration.unregister()));
    }catch(error){console.warn('Papercraft service-worker cleanup skipped:',error);}
  });
}
