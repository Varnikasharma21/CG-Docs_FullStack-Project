using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using FinalCGDOCS.Models;
using FinalCGDOCS.RequestModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace FinalCGDOCS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly DriveContext _cgcontext;
        private IHostingEnvironment _environment;
        public DocumentController(DriveContext project, IHostingEnvironment env)
        {
            _cgcontext = project;
            _environment = env;
        }


        [HttpGet]
        public IActionResult Get()
        {
            var getInfo = _cgcontext.Documents.ToList();
            return Ok(getInfo);
        }

        [HttpGet("{id:int}")]
        public IActionResult Get(int id)
        {
            try
            {
                var result = _cgcontext.Documents.Where(obj => obj.FolderId == id && obj.DocumentIsDeleted == false);

                if (result == null) return NotFound();

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }

        //show details of files
        [HttpGet("details/{id:int}")]
        public IActionResult ShowDetails(int id)
        {
            try
            {
                var result = _cgcontext.Documents.First(obj => obj.DocumentId== id);

                if (result == null) return NotFound();

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }

        // POST
        [HttpPost]
        public void Post([FromBody] DocumentsRequest value)
        {
            try
            {
                Documents obj = new Documents();
                obj.DocumentName = value.DocumentName;
                obj.DocumentType = value.DocumentType;
                obj.DocumentSize = value.DocumentSize;
                obj.DocumentCreatedAt = value.DocumentCreatedAt;
                obj.DocumentCreatedBy = value.DocumentCreatedBy;
                obj.DocumentIsDeleted = value.DocumentIsDeleted;
                obj.FolderId = value.FolderId;
                obj.DocumentIsFavourite = false;
                _cgcontext.Documents.Add(obj);
                _cgcontext.SaveChanges();
            }
            catch (Exception)
            {

            }

        }
        //upload a file
        [HttpPost]
        [Route("upload/{createdAt}/{createdBy}/{folderId}")]
        public async Task<ActionResult> Upload(List<IFormFile> files, DateTime createdAt, int createdBy, int folderId)
        {
            long size = files.Sum(f => f.Length);
            var rootPath = Path.Combine(_environment.ContentRootPath, "Resources", "Documents");
            if (!Directory.Exists(rootPath))
                Directory.CreateDirectory(rootPath);
            foreach (var file in files)
            {
                var filePath = Path.Combine(rootPath, file.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    var Documents = new Documents
                    {
                        DocumentName = file.FileName,
                        DocumentType = file.ContentType,
                        DocumentSize = (int)file.Length,
                        DocumentCreatedAt = createdAt,
                        DocumentCreatedBy = createdBy,
                        FolderId = folderId,
                        DocumentIsDeleted = false,
                        DocumentIsFavourite = false


                    };
                    await file.CopyToAsync(stream);

                    _cgcontext.Documents.Add(Documents);
                    await _cgcontext.SaveChangesAsync();
                }
            }


            return Ok(new { count = files.Count, size });
        }
        //download a file
        [HttpPost]
        [Route("download/{id}")]
        public async Task<ActionResult> Download(int id)
        {
            try
            {
                var provider = new FileExtensionContentTypeProvider();
                var document = _cgcontext.Documents.FirstOrDefault(o => o.DocumentId == id);
                if (document == null)
                    return NotFound();
                var file = Path.Combine(_environment.ContentRootPath, "Resources", "Documents", document.DocumentName);
                string contentType;
                if (!provider.TryGetContentType(file, out contentType))
                {
                    contentType = "application/octet-stream";
                }

                byte[] fileBytes;
                if (System.IO.File.Exists(file))
                {
                    fileBytes = System.IO.File.ReadAllBytes(file);
                }
                else
                {
                    return NotFound();
                }
                return File(fileBytes, contentType, document.DocumentName);
            }
            catch (Exception e)
            {

            }
            return null;
        }


        [HttpGet("{value}")]
        public IActionResult Get(string value)
        {

            var result = _cgcontext.Documents.Where(obj => obj.DocumentName.Contains(value));
            return Ok(result);
        }
         
        //soft delete
        [HttpPut("{id}")]
        public IActionResult Put(int id)
        {
            int m = 0;
            try
            {
                var newobj = _cgcontext.Documents.First(obj => obj.DocumentId == id);
                newobj.DocumentIsDeleted = true;
                _cgcontext.Documents.Update(newobj);
                _cgcontext.SaveChanges();
                m = 200;
            }
            catch (Exception e)
            {
                m = 404;
            }
            return StatusCode(m);
        }
        // hard delete a file
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var matches = _cgcontext.Documents.Where(res => res.DocumentId == id).ToList();
            matches.ForEach(res => _cgcontext.Documents.Remove(res));
            _cgcontext.SaveChanges();

        }
        //search a file
        [HttpGet("{value},{id:int},{userid:int}")]
        public IActionResult Get(string value, int id, int userid)
        {

            var result = _cgcontext.Documents.Where(e => e.DocumentCreatedBy == userid).Where(o => o.FolderId == id).Where(obj => obj.DocumentName.Contains(value) && obj.DocumentIsDeleted == false);
            return Ok(result);
        }

        //undelete
        [HttpPut("Undelete/{id}")]
        public IActionResult RemoveDelete(int id)
        {
            int m = 0;
            try
            {
                var newobj = _cgcontext.Documents.First(obj => obj.DocumentId == id);
                newobj.DocumentIsDeleted = false;
                _cgcontext.Documents.Update(newobj);
                _cgcontext.SaveChanges();
                m = 200;
            }
            catch (Exception e)
            {
                m = 404;
            }
            return StatusCode(m);
        }
        //show favourite
        [HttpGet("favourite/{id}")]
        public IActionResult ShowFavourite(int id)
        {
            try
            {
                var result = _cgcontext.Documents.Where(o => o.DocumentIsFavourite == true && o.FolderId == id && o.DocumentIsDeleted == false);
                return Ok(result);
            }
            catch (Exception e)
            {
                return null;
            }

        }

     
        //trash
        [HttpGet("Trash/{id}")]
        public IActionResult ShowTrash(int id)
        {
            try
            {
                var result = _cgcontext.Documents.Where(o => o.DocumentIsDeleted == true && o.FolderId == id);
                return Ok(result);
            }
            catch (Exception e)
            {
                return null;
            }

        }
        //favorite
        [HttpPut("favourite/{id}")]
        public IActionResult PutFavourite(int id)
        {
            int m = 0;
            try
            {
                var newobj = _cgcontext.Documents.First(obj => obj.DocumentId == id);
                newobj.DocumentIsFavourite = true;
                _cgcontext.Documents.Update(newobj);
                _cgcontext.SaveChanges();
                m = 200;
            }
            catch (Exception e)
            {
                m = 404;
            }
            return StatusCode(m);
        }
        //remove favourite
        [HttpPut("Removefav/{id}")]
        public IActionResult RemoveFavourite(int id)
        {
            int m = 0;
            try
            {
                var newobj = _cgcontext.Documents.First(obj => obj.DocumentId == id);
                newobj.DocumentIsFavourite = false;
                _cgcontext.Documents.Update(newobj);
                _cgcontext.SaveChanges();
                m = 200;
            }
            catch (Exception e)
            {
                m = 404;
            }
            return StatusCode(m);
        }
        //show recent
        [HttpGet("Recent/{userId}/{folderId}/{time}")]
        public IActionResult showRecent(int userId, int folderId, int time)
        {
            int m = 0;
            try
            {

                if (time == 1)
                {
                    var createdAt = DateTime.Now.AddMinutes(-60);

                    var res = _cgcontext.Documents.Where(o => o.DocumentCreatedAt >= createdAt && o.DocumentCreatedBy == userId && o.FolderId == folderId);
                    return Ok(res);
                }
                else if (time == 30)
                {
                    var createdAt = DateTime.Now.AddMinutes(-30);

                    var res = _cgcontext.Documents.Where(o => o.DocumentCreatedAt >= createdAt && o.DocumentCreatedBy== userId && o.FolderId == folderId);
                    return Ok(res);
                }
                else
                {
                    var createdAt = DateTime.Now.AddMinutes(-15);

                    var res = _cgcontext.Documents.Where(o => o.DocumentCreatedAt >= createdAt && o.DocumentCreatedBy == userId && o.FolderId == folderId);
                    return Ok(res);
                }

            }
            catch (Exception e)
            {
                m = 404;
                return StatusCode(m);
            }

        }
    }
}
