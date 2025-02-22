import { useEffect, useState } from 'react'
import './App.css'

function App() {
 const [Title,setTitle] = useState("");
 const [Description,setDescription] = useState("");
 const [Todos,setTodos] = useState([]);
 const [error,setError] = useState("");
 const [Message,setMessage] = useState("");
 const [editId,setEditId] = useState(-1);

 //edit btn

 const [editTitle,seteditTitle] = useState("");
 const [editDescription,seteditDescription] = useState("");

 // create items
 const apiUrl = 'http://localhost:8000'
 const hanDleSubmit = () =>{
  setError("");
     if(Title !== '' && Description !== ''){
      fetch(apiUrl +"/todo/",{
        method: 'POST',
        headers: {
         'Content-Type':'application/json'
        },
        body: JSON.stringify({title: Title, description: Description})
      }).then(res=>{
        if(res.ok){
          setTodos([... Todos,{title: Title, description: Description}]);
          setMessage("Item Added Successfully!");
          setTimeout(() => {
            setMessage("");
          }, 2000);
          setTitle("");
          setDescription("");
        }
        else{
           setError("Unable to submit");
        }
      }).catch(()=>{
        setError("Unable to submit");
      })
      
     }
 }
 useEffect(()=>{
  getval();
 },[]);
 
 const getval = () =>{
  fetch(apiUrl+'/todo')
  .then((res)=>res.json())
  .then((res)=>{
    setTodos(res);
    
  })
 }

 // delete item
 
 //edit items
 const setEditfunction = (ele) =>{
  setEditId(ele._id);
  seteditTitle(ele.title);
  seteditDescription(ele.description)

 }
 // cancel
 const handleCancel = () =>{
  setEditId(-1);
 }
 //update function 

 const handleupdate = () =>{
  if(editTitle!== '' && editDescription !== ''){
    fetch(apiUrl +"/todo/" +editId,{
      method: 'PUT',
      headers: {
       'Content-Type':'application/json'
      },
      body: JSON.stringify({title: editTitle, description: editDescription})
    }).then(res=>{
      if(res.ok){
        const edittodos = Todos.map((data)=>{
          if(data._id == editId){
            data.title = editTitle;
            data.description = editDescription;
          }
          return data;
        })
        setTodos(edittodos);
        setMessage("Item Updated Successfully!");
      
        setTimeout(() => {
          setMessage("");
        }, 2000);
        setEditId(-1);
        setTitle("");
        setDescription("");
      }
      else{
         setError("Unable to submit");
      }
    }).catch(()=>{
      setError("Unable to submit");
    })
    
   }
 }
 const handledelete = (id) =>{
  if(window.confirm("are you sure you want to DELETE")){
    fetch(apiUrl +"/todo/" +id,{
      method: "DELETE",
    })
    .then(()=>{
      const deletetods = Todos.filter((item)=>item._id!==id);
      setTodos(deletetods)
    })
  }
}
  return (
    < >
     <div className='container text-light'>
     <div className='row mt-3 '>  
     <div className='row text-center bg-primary '><h1>To do Items</h1></div>
      <h3 className='mt3'>Add Items</h3>
     {Message &&<p className='text-success'>{Message}</p>}
     <div className='form-group d-flex gap-2'>
      <input className='form-control' onChange={(e)=>setTitle(e.target.value)} value={Title}  type="text" placeholder='Title' />
      <input className='form-control'  onChange={(e)=>setDescription(e.target.value)} value={Description}  type="text" placeholder='Description' />
      <button className='btn text-bg-primary' onClick={hanDleSubmit}>submit</button>
     </div>
     </div>
     {error &&<p className='text-danger'>{error}</p>}

     <div className="row mt-3 ">
      <ul className='list-group'>
          {
            Todos.map((ele)=>
              <li className='list-group-item d-flex justify-content-between align-items-center my-2 '>
              <div className='d-flex flex-column me-2'>
                {
                   editId == -1 ||editId !==ele._id?<>
                   <span className='fw-bold'>{ele.title}</span>
                   <span >{ele.description}</span>
                  </> : <>
                  <div className='form-group d-flex gap-2'>
                 <input className='form-control' onChange={(e)=>seteditTitle(e.target.value)} value={editTitle}  type="text" placeholder='Title' />
                <input className='form-control'  onChange={(e)=>seteditDescription(e.target.value)} value={editDescription}  type="text" placeholder='Description' />
     </div>
                  </>
                }
              </div>
             <div className="d-flex gap-2">
             { editId == -1 ||editId !==ele._id? <button className="btn btn-warning" onClick={() => setEditfunction(ele)}>Edit</button>:
             <button className="btn btn-warning" onClick={() => handleupdate()}>Update</button> }
             {editId == -1 ||editId !==ele._id? <button className="btn btn-danger"  onClick={() => handledelete(ele._id)}>Delete</button>:
             <button className="btn btn-danger" onClick={() => handleCancel()}>Cancel</button>}
             </div>
            </li>
            )
          }
      </ul>
     </div>

     </div>
    </>
  )
}
export default App
