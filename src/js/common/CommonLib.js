// provide common methods for services

module.exports = {

	MAX_RESPONSE_PAGE_SIZE : 2,
	DEFAULT_LIST_PAGINATION : "http://localhost:3500/api/student/list/page/",
	STUDENT_STATUS_LIST_PAGINATION : "http://localhost:3500/api/student/status/",
	
	MSG_CODE_OK : "MSG_CODE_OK",
	MESSAGE_OK : "OK",

	MSG_CODE_INVALID_OR_NO_PAGINATION_SPECIFIED : "MSG_CODE_INVALID_OR_NO_PAGINATION_SPECIFIED",
	MESSAGE_INVALID_PAGINDATION : "The requested resource requires pagination. Either no page was specified in the request or page was invalid, defaulting to page 1",

	
	addApiMetadataForList : function (apiResultArray, apiLocation, req, nextRequestUrl="", requestDescr="") {
		
		let messageCode = this.MSG_CODE_OK;
		let message = this.MESSAGE_OK;
		
		// page size: e.g. we only want to return max 20 items at a time if we have too many records
		// add logic to get correct page
		let page = (req==null||req.params.page==undefined)? 0 : parseInt(req.params.page); 
		let totalPages = Math.ceil(apiResultArray.length / this.MAX_RESPONSE_PAGE_SIZE);
		if (page < 1 || page > totalPages)	{
			page  = 1;
			messageCode = this.MSG_CODE_INVALID_OR_NO_PAGINATION_SPECIFIED;
			message = this.MESSAGE_INVALID_PAGINDATION;
		}
		
		let totalItems = apiResultArray.length;

		let morePages = (page * this.MAX_RESPONSE_PAGE_SIZE) < totalItems?  true: false;
		let relevantRequests = [];

		// should I suggest next page? 
		// figure out how to fill in params for the next url
		
		if (morePages){
			let nextPage  = parseInt(page) + 1;
			
			if(req.originalUrl.includes("/status"))	{
				// next urls
				relevantRequests[0] = nextRequestUrl + req.params.status + "/page/" + nextPage;						
			}
			else{
				relevantRequests[0] = nextRequestUrl + nextPage;
			}
		}

		// add alternatives requests
		if(req.originalUrl.includes("/status"))	{
			let additionalRequests = this.getAlternativeRequests(req, this.STUDENT_STATUS_LIST_PAGINATION);
			if(additionalRequests!=null && additionalRequests.length>0){
				relevantRequests = relevantRequests.concat(additionalRequests);
			}
		}
	
	
    if (apiResultArray > this.MAX_RESPONSE_PAGE_SIZE){
		totalReturned = this.MAX_RESPONSE_PAGE_SIZE;
	}

	// now slice the data and return correct number of records
	let startIndex = ((page-1) * this.MAX_RESPONSE_PAGE_SIZE);
	let endIndex =   (startIndex + this.MAX_RESPONSE_PAGE_SIZE);
	
	totalPages = totalPages < 1? 1 : totalPages;
	let list = {};
	list.meta = {
		messageCode: messageCode
		,message: message
		,request_description: requestDescr
		,resource_location: apiLocation
		,result_type: "list"
		,page: page + ' of ' + totalPages
		,page_size: this.MAX_RESPONSE_PAGE_SIZE
		,relevant_requests: relevantRequests
	};

	list.students = apiResultArray.slice(startIndex, endIndex);
	return list;
},

addApiMetadataForSingleItem : function (apiResultItem, apiLocation, req=null, nextRequestUrl="", requestDescr=""){

	let item = {};
	item.meta = {
		 messageCode: this.MSG_CODE_OK
		,message: this.MESSAGE_OK
		,request_description: "return a single item matching the request"
		,resource_location: apiLocation
		,result_type: "single_item"
		/* ,relevant_requests: relevantRequests */ // for future
	};

	item.student = apiResultItem;
	return item;
},

getAlternativeRequests : function ( req, alternativeRequestUrl) {
		
	let additionalRequests = [];

	// /api/student/status/1/page/1
	if(req.originalUrl.includes("/status"))
	{
		// suggest alternative url
		if(req.params.status==1){
			additionalRequests[0] = alternativeRequestUrl + 0 + "/page/1";
		}
		else {
			additionalRequests[0] = alternativeRequestUrl + 1 + "/page/1";
		}
	}
	return additionalRequests;
}

};
