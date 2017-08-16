// describe('try-group-request-confirmation.component', () => {
//   it('Submits', () => {
//     const baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;
//     const groupId = 12345;

//     const mockBackend = $httpBackend.when('POST', `${this.baseUrl}api/v1.0.0/finder/pin/tryagroup`).respond(200);

//     $httpBackend.expectPost(`${this.baseUrl}api/v1.0.0/finder/pin/tryagroup`, groupId);
//     $httpBackend.flush();

//     expect(this.router.navigate).toHaveBeenCalledWith([`/try-group-request-success/${this.groupId}`]);
//   });

//   it('Handles submission errors', () => {
//     // 409 Error:
//     const mockBackend = $httpBackend.when('POST', `${this.baseUrl}api/v1.0.0/finder/pin/tryagroup`)
//     .respond(409);
//     expect(comp.errorMessage).toEqual('tryGroupRequestAlreadyRequestedFailureMessage');

//     // Other Error:
//     mockBackend.respond(400);
//     expect(comp.errorMessage).toEqual('tryGroupRequestGeneralFailureMessage');
//   });

//   it('Navigates "back" when close ("x") is clicked', () => {
//     expect(window.history.back).toHaveBeenCalled();
//   });

//   it('Navigates "back" when cancel is clicked', () => {
//     expect(window.history.back).toHaveBeenCalled();
//   });
// });
