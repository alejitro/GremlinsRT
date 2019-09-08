function loadScript(callback) {
  var s = document.createElement('script');
  s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
  if (s.addEventListener) {
    s.addEventListener('load', callback, false);
  } else if (s.readyState) {
    s.onreadystatechange = callback;
  }
  document.body.appendChild(s);
  var d = document.createElement('script');
  d.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
  document.body.appendChild(d);
}

function unleashGremlins(ttl, callback) {
  function stop() {
    horde.stop();
    callback();
  }
  var horde = window.gremlins.createHorde();
  horde.gremlin(gremlins.species.formFiller().canFillElement(function(){
      return $('input').length;
  }))
  .gremlin(gremlins.species.clicker().clickTypes(['click'])
    .canClick(function() {
        var elements = $('a,button');
        if(elements>0){
            return elements.length;
        }else {
            setTimeout(stop, ttl);
        }

    }))
  .strategy(gremlins.strategies.distribution()
				.delay(50)
				.distribution([
					0.3, // formFiller
					0.7, // clicker
				])
	)
  .gremlin(function() {
      window.$ = function() {};
  });

  horde.seed(1234);

  horde.after(callback);
  window.onbeforeunload = stop;
  setTimeout(stop, ttl);
  horde.unleash();
}

describe('Monkey testing with gremlins ', function() {

  it('it should click on buttons and links and fill form elements', function() {
    browser.url('/');
    browser.click('button=Cerrar');

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(loadScript);

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(unleashGremlins, 50000);
  });

  afterAll(function() {
    browser.log('browser').value.forEach(function(log) {
      browser.logger.info(log.message.split(' ')[2]);
      //browser.logger.info(log.message);
    });
  });

});
