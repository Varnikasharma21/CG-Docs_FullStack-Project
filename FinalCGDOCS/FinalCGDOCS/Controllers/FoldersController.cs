using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinalCGDOCS.Models;
using FinalCGDOCS.RequestModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinalCGDOCS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FolderController : ControllerBase
    {
        private readonly DriveContext _cgcontext;
        public FolderController(DriveContext cg)
        {
            _cgcontext = cg;
        }
        //Show details of particular folder
        [HttpGet("details/{id:int}")]
        public IActionResult ShowDetails(int id)
        {
            try
            {
                var result = _cgcontext.Folders.First(obj => obj.FolderId == id);

                if (result == null) return NotFound();

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }


        //Show folders by user id
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                var result = _cgcontext.Folders.Where(obj => obj.FolderCreatedBy == id && obj.FolderIsDeleted == false);

                if (result == null) return NotFound();

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }

        //show favourites
        [HttpGet("favourite/{id}")]
        public IActionResult ShowFavourite(int id)
        {
            try
            {
                var result = _cgcontext.Folders.Where(o => o.FolderIsFavourite == true && o.FolderCreatedBy == id && o.FolderIsDeleted == false);
                return Ok(result);
            }
            catch (Exception e)
            {
                return null;
            }

        }
        //show trash
        [HttpGet("Trash/{id}")]
        public IActionResult ShowTrash(int id)
        {
            try
            {
                var result = _cgcontext.Folders.Where(o => o.FolderIsDeleted == true && o.FolderCreatedBy == id);
                return Ok(result);
            }
            catch (Exception e)
            {
                return null;
            }

        }

        //add folder to favourites
        [HttpPut("favourite/{id}")]
        public IActionResult PutFavourite(int id)
        {
            int m = 0;
            try
            {

                var res = _cgcontext.Documents.Where(o => o.FolderId == id).ToList();
                foreach (var objj in res)
                {
                    objj.DocumentIsFavourite = true;
                    _cgcontext.Documents.Update(objj);
                    _cgcontext.SaveChanges();

                }
                var newobj = _cgcontext.Folders.First(obj => obj.FolderId == id);
                newobj.FolderIsFavourite = true;
                _cgcontext.Folders.Update(newobj);
                _cgcontext.SaveChanges();
                m = 200;
            }
            catch (Exception e)
            {
                m = 404;
            }
            return StatusCode(m);
        }

        //remove from favourites
        [HttpPut("Removefav/{id}")]
        public IActionResult RemoveFavourite(int id)
        {
            int m = 0;
            try
            {
                var res = _cgcontext.Documents.Where(o => o.FolderId == id).ToList();
                foreach (var objj in res)
                {
                    objj.DocumentIsFavourite = false;
                    _cgcontext.Documents.Update(objj);
                    _cgcontext.SaveChanges();

                }
                var newobj = _cgcontext.Folders.First(obj => obj.FolderId == id);
                newobj.FolderIsFavourite = false;
                _cgcontext.Folders.Update(newobj);
                _cgcontext.SaveChanges();
                m = 200;
            }
            catch (Exception e)
            {
                m = 404;
            }
            return StatusCode(m);
        }

        //adding a new folder
        [HttpPost]
        public void Post([FromBody] FoldersRequest value)
        {
            Folders obj = new Folders();
            obj.FolderName = value.FolderName;
            obj.FolderCreatedAt = DateTime.Now;
            obj.FolderCreatedBy = value.FolderCreatedBy;
            obj.FolderIsDeleted = false;
            obj.FolderIsFavourite= false;
            _cgcontext.Folders.Add(obj);
            _cgcontext.SaveChanges();
        }


        //soft deleting a folder
        [HttpPut("SoftDeleted/{id}")]
        public IActionResult Put(int id)
        {
            int m = 0;
            try
            {
                var res = _cgcontext.Documents.Where(o => o.FolderId == id).ToList();
                foreach (var objj in res)
                {
                    objj.DocumentIsFavourite = true;
                    _cgcontext.Documents.Update(objj);
                    _cgcontext.SaveChanges();

                }
                var newobj = _cgcontext.Folders.First(obj => obj.FolderId == id);
                newobj.FolderIsDeleted = true;
                _cgcontext.Folders.Update(newobj);
                _cgcontext.SaveChanges();
                m = 200;
            }
            catch (Exception e)
            {
                m = 404;
            }
            return StatusCode(m);
        }

        //undeleting a folder
        [HttpPut("Undelete/{id}")]
        public IActionResult RemoveDelete(int id)
        {
            int m = 0;
            try
            {
                var res = _cgcontext.Documents.Where(o => o.FolderId == id).ToList();
                foreach (var objj in res)
                {
                    objj.DocumentIsDeleted = false;
                    _cgcontext.Documents.Update(objj);
                    _cgcontext.SaveChanges();

                }
                var newobj = _cgcontext.Folders.First(obj => obj.FolderId == id);
                newobj.FolderIsDeleted = false;
                _cgcontext.Folders.Update(newobj);
                _cgcontext.SaveChanges();
                m = 200;
            }
            catch (Exception e)
            {
                m = 404;
            }
            return StatusCode(m);
        }
        //searching a folder
        [HttpGet("{id:int}/{value}")]
        public IActionResult SearchResult(int id, string value)
        {

            var result = _cgcontext.Folders.Where(o => o.FolderCreatedBy== id).Where(obj => obj.FolderName.Contains(value) && obj.FolderIsDeleted==false );
            return Ok(result);
        }
        


        //searching a folder in trash
        [HttpGet("trashSearch/{id:int}/{value}")]
        public IActionResult SearchTrash(int id, string value)
        {

            var result = _cgcontext.Folders.Where(o => o.FolderCreatedBy == id).Where(obj => obj.FolderName.Contains(value) && obj.FolderIsDeleted == true);
            return Ok(result);
        }

        //searching a folder in favorite
        [HttpGet("FavoriteSearch/{id:int}/{value}")]
        public IActionResult SearchFavorite(int id, string value)
        {

            var result = _cgcontext.Folders.Where(o => o.FolderCreatedBy == id).Where(obj => obj.FolderName.Contains(value) && obj.FolderIsFavourite==true);
            return Ok(result);
        }

        //delete a folder permanent
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var document = _cgcontext.Documents.Where(res => res.FolderId == id).ToList();
            document.ForEach(res => _cgcontext.Documents.Remove(res));
            _cgcontext.SaveChanges();
            var folderdel = _cgcontext.Folders.Where(res => res.FolderId == id).ToList();
            folderdel.ForEach(res => _cgcontext.Folders.Remove(res));
            _cgcontext.SaveChanges();

        }

        //recent folders
        [HttpGet("Recent/{userId}/{time}")]
        public IActionResult showRecent(int userId, int time)
        {
            int m = 0;
            try
            {
                if (time == 10)
                {
                    var createdAt = DateTime.Now.AddHours(-6);

                    var res = _cgcontext.Folders.Where(o => o.FolderCreatedAt >= createdAt && o.FolderCreatedBy== userId && o.FolderIsDeleted==false);
                    return Ok(res);
                }
                else if (time == 30)
                {
                    var createdAt = DateTime.Now.AddHours(-12);

                    var res = _cgcontext.Folders.Where(o => o.FolderCreatedAt >= createdAt && o.FolderCreatedBy == userId && o.FolderIsDeleted == false);
                    return Ok(res);
                }
                else
                {
                    var createdAt = DateTime.Now.AddHours(-24);

                    var res = _cgcontext.Folders.Where(o => o.FolderCreatedAt >= createdAt && o.FolderCreatedBy == userId && o.FolderIsDeleted == false);
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
