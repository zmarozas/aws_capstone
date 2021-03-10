export class ApiResponseHelper {
   generateSucessResponse (statusCode: number, key :string, items:any  ) {
    return {
      statusCode: statusCode,
      body: JSON.stringify({
        [key]: items
      })
    }
  }

  generateEmptySuccessResponse (statusCode: number) {
    return {
      statusCode: statusCode,
      body: ''
    }
  }

  generateErrorResponse (statusCode: number,message:string  ) {
    return {
      statusCode: statusCode,
      body: JSON.stringify({
        message
      })
    }
  }
}