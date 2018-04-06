<?php 
class model
{
    private $obapiurl, $obapikey; //Setup private variables

    function __construct($config)
    {
        if($config["api_key"]=="" || $config["api_key"]=="COPY_YOUR_API_KEY_HERE"){
			die("Please paste your API KEY in config.php which is located under library folder.");
		}
        $this->obapiurl = $config["api_url"]; //Get api url while creating object
		$this->obapikey = $config["api_key"]; //Get api key while creating object
		
	}
	
	private function curlPOIAPI($url, $apiKey = null){
		
		$curl = curl_init(); //cURL initialization
		
		//Set cURL array with require params
		curl_setopt_array($curl, array(
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => array(
				"accept: application/json",
				"apikey: " . ($apiKey!=''?$apiKey:$this->obapikey)
			)
		));
      
		$response = curl_exec($curl);
		$err = curl_error($curl);
		//echo "<pre>"; print_r($err); die;
		curl_close($curl);
	 
		if ($err) {
			return '{"status": { "code": 999, "msg": "cURL Error #:" . $err."}}';
		}else{
			return json_decode($response, true);
		}
	}
    
	public function getPoiData($address,$radius){
		$url = $this->obapiurl ."/poisearch/v2.0.0/poi/street+address?StreetAddress=$address&SearchDistance=$radius&RecordLimit=50";
		return $this->curlPOIAPI($url);  
	}
	
	public function getCommunityByAreaId1($areaid)
    {
		$url = $this->obapiurl . "/communityapi/v2.0.0/area/full?AreaId=" . $areaid;
    	
		$result_community1 = $this->curlPOIAPI($url); 	
			
		$communityData = array();
	
		if(count(@$result_community1['response']['result']['package']['item'])>0){
			foreach($result_community1['response']['result']['package']['item'][0] as $resultCommKey=>$resultCommVal){
					$communityData[strtoupper($resultCommKey)] = $resultCommVal;
			}
		}
		
		$communityData1[0] = $communityData;
		
		$communityDataFinal = json_decode (json_encode ($communityData1), FALSE);
		
		return $communityDataFinal;
	}
}	
?>
