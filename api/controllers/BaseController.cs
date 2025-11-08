using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace mutuelleApi.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BaseController : ControllerBase
    {
        protected int GetUserId()
        {
            var nameIdentifierClaim = User?.FindFirst(ClaimTypes.NameIdentifier);
            if (nameIdentifierClaim == null || string.IsNullOrEmpty(nameIdentifierClaim.Value))
            {
                throw new InvalidOperationException("User ID claim is missing or invalid.");
            }

            return int.Parse(nameIdentifierClaim.Value);
        }
    }
}