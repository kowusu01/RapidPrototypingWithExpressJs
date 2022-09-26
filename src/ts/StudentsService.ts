
// acts a service to provide data - this could be a web service
export class StudentsService
{

    fakeData : any =
    [
        { "ID": 100, "FirstName": "John",  "LastName": "Bayor",  "DateAdded":"2022-09-10", "IsActive": 1},
        { "ID": 101, "FirstName": "Marie", "LastName": "Mavais", "DateAdded":"2022-07-15", "IsActive": 1},
        { "ID": 102, "FirstName": "Peter", "LastName": "Struss",   "DateAdded":"2022-05-01", "IsActive": 1},
        { "ID": 103, "FirstName": "Alan", "LastName": "Trent",   "DateAdded":"2022-04-04", "IsActive": 1},
        { "ID": 104, "FirstName": "Ana", "LastName": "Perrol",   "DateAdded":"2022-04-21", "IsActive": 1},
        { "ID": 105, "FirstName": "Steve", "LastName": "Williams", "DateAdded":"2021-05-17", "IsActive": 1},
        { "ID": 106, "FirstName": "Terry", "LastName": "DeVille",   "DateAdded":"2021-05-21", "IsActive": 0},
        { "ID": 107, "FirstName": "Don", "LastName": "Debraks",   "DateAdded":"2022-03-01", "IsActive": 1},
        { "ID": 108, "FirstName": "Rose", "LastName": "Stephens",   "DateAdded":"2021-01-16", "IsActive": 1},
        { "ID": 109, "FirstName": "Martha", "LastName": "Stalwood",   "DateAdded":"2020-01-31", "IsActive": 0} 
    ];


    getItemById(id: number): any {

        const result = this.fakeData.find(item => item.ID == id);

         if (result == null)
         {
            console.log('StudentsService - no student found for id: ' + id);
         }
         else{
            console.log('StudentsService  - found 1  student for id: ' + id);
         }
        return result;
    }

    getItemByStatus(status: string): any {

        const result = this.fakeData.filter(item => item.IsActive == status);

         if (result.length < 1)   
         {
            console.log('StudentsService - no student found for status: ' + status);
         }
         else{
            console.log('StudentsService  - found ' + result.length + ' student(s) for status: ' + status);
         }
        return result;
    }

    getAllItems(page: any, page_size: any): any {

        // use page and page size to limit data returned
        return this.fakeData;
    }

    getWelcome(): string
    {
        return 'Welcome! Students Api Service is up and running.';
    }

}


