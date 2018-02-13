document.onreadystatechange = function () {
	  var state = document.readyState
	  if (state == 'interactive') {
		   document.getElementById('body').style.visibility="hidden";
		   document.getElementById('header').style.visibility="hidden";
	  } else if (state == 'complete') {
		  setTimeout(function(){
			 document.getElementById('interactive');
			 document.getElementById('load').style.visibility="hidden";
			 document.getElementById('body').style.visibility="visible";
			 document.getElementById('header').style.visibility="visible";
			$("#1").trigger("click");
		  },1000);
	  }
	} 
	$(function(){
		
		$(".dropdown-menu li a").click(function(){
		  $(".btn:first-child").text($(this).text());
		  $(".btn:first-child").val($(this).text());
		  $('#radius').val($(this).attr('data-val'));
	    });
		
		setTimeout(function(){$('#body').css("min-height",(parseInt($( window ).height())-55)+"px");},500);
		
	});
	
	
	
	$('.businessCatAction').on('click',function(){
		
		var searchAddr = $('#search').val();
		var searchradius = $('#radius').val();
		
		var checkedArr = [];
		setTimeout(function(){
			$('.form-group input[type="checkbox"]:checked').each(function(){
            checkedArr.push($(this).val());
        });
			//console.log(checkedArr);
			refreshData(checkedArr,searchAddr,searchradius);
		},500);
        		
	});

	
	
	/*SearchByPropertyScript*/
	$('#searchByProperty').click(function(){
		
		var org_val = $("#searchByProperty").val();//MAKE THE BUTTON FADE AFTER CLICKED ON IT
		$("#searchByProperty").val('Wait...');//MAKE THE BUTTON FADE AFTER CLICKED ON IT
		$("#searchByProperty").attr('disabled',true);//MAKE THE BUTTON FADE AFTER CLICKED ON IT
		$("#ajaxLoad").show();//SHOW THE LOADER WHEN AJAX REQUESTED
		$('#innerCont').addClass('overlayBg');
		
		var search = $('#search').val();
		var checkValidate = true;	
		var message = '';	
		$("span.customerror").html(message);
		
		$("#searchByPropForm input[required=true]").each(function(){
			$(this).css('border-color',''); 
			if(!$.trim($(this).val())){ //if this field is empty 
				$(this).css('border-color','red'); //change border color to red   
				checkValidate = false; //set do not proceed flag
				message = 'This field is required.';				
				$("span.customerror").html(message);
			}
		});	
			
		if(checkValidate && search!=''){
			var search = search.replace("#",",");
			var explodeAddr = search.split(',');
			
			var add2Str = '';
			for(i=0;i<explodeAddr.length;i++){
				if(i==0){continue;}
				if(i==1){add2Str+=$.trim(explodeAddr[i]);continue;}
				add2Str+= ','+explodeAddr[i];
			}
			
			var pCode = $('#postal_code').val();
			var radius = $('#radius').val();
			
			
				
			var urlToExecute = 'index.php?address='+search+'&radius='+radius;
			
			//reset previously set border colors and hide all message on .keyup()
			$("#searchByPropForm  input[required=true]").keyup(function() { 
				$(this).css('border-color',''); 
				//$("#result").slideUp();
			});
			$("#searchByProperty").val(org_val);//MAKE THE BUTTON FADE AFTER CLICKED ON IT
			$("#searchByProperty").attr('disabled',false);	
			window.location.href = urlToExecute;
		}
		$("#searchByProperty").val(org_val);//MAKE THE BUTTON FADE AFTER CLICKED ON IT
		$("#searchByProperty").attr('disabled',false);
		$("#ajaxLoad").hide();//HIDE THE LOADER WHEN AJAX REQUESTED
		$('#innerCont').removeClass('overlayBg');
		
	});
	/*SearchByPropertyScript*/
	
	/* Auto google location suggestion */
	var placeSearch, autocomplete;
	var componentForm = {
		postal_code: 'short_name'
	};

	function initAutocomplete() {
		autocomplete = new google.maps.places.Autocomplete(
			/** @type {!HTMLInputElement} */(document.getElementById('search')),
			{types: ['geocode']});
		autocomplete.addListener('place_changed', fillInAddress);
		

		//autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('city_zip'), {types: ['(cities)'],componentRestrictions: { country: "usa" }});
		/*google.maps.event.addListener(autocomplete2, 'place_changed', function() {
		  fillInAddress();
		});*/
	}

	function fillInAddress() {
		hideLabel();
		// Get the place details from the autocomplete object.
		var place = autocomplete.getPlace();

		for (var component in componentForm) {
		  document.getElementById(component).value = '';
		  document.getElementById(component).disabled = false;
		}

		// Get each component of the address from the place details
		// and fill the corresponding field on the form.
		for (var i = 0; i < place.address_components.length; i++) {
		  var addressType = place.address_components[i].types[0];
		  if (componentForm[addressType]) {
			var val = place.address_components[i][componentForm[addressType]];
			
			document.getElementById(addressType).value = val;
		  }
		}
		
		document.getElementById('search').value = document.getElementById('search').value + ' '+document.getElementById('postal_code').value;
	}

	function hideLabel(){
			var message = '';	
			$("span.customerror").html(message);
		}

	// Bias the autocomplete object to the user's geographical location,
	// as supplied by the browser's 'navigator.geolocation' object.
	function geolocate() {
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(function(position) {
			var geolocation = {
			  lat: position.coords.latitude,
			  lng: position.coords.longitude
			};
			var circle = new google.maps.Circle({
			  center: geolocation,
			  radius: position.coords.accuracy
			});
			autocomplete.setBounds(circle.getBounds());
		  });
		}
	}
	
	function ScrollToTop(el, callback) { 
		$('html, body').animate({ scrollTop: $(el).offset().top - 50 }, 'slow', callback);
	} 
	
	/* Auto google location suggestion */
	
	
	
	/*Call search function when someone cick on enter key*/
	$('#search').keypress(function (e) {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			$('#searchByProperty').click();
			return false;  
		}
	}); 
	function refreshData(checkedArr,streetAddress,radiusVal){
		$.ajax({
				url: 'poi-content.php',
				type: 'post',
				data: { businessCat: checkedArr,address: streetAddress, radius: radiusVal},
				beforeSend: function() {
					  $('.ajax-loader').show();
				},
				success:function(response) {
					$('.ajax-loader').hide();
					$("#poiContent").html(response);										
					var focusElement = $("#map");
					ScrollToTop(focusElement, function() { focusElement.focus(); });
						
				}
			});
			return false;
	}
	
	  	
	  