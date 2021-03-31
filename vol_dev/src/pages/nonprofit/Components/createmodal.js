const CreateModal = () => {
    return ( 
        <div className="create-modal">
            <h1>Create a new project</h1>
            <div>
                <h5>Title</h5>
                <input type="text"/>
            </div>
            <div>
                <h5>Description</h5>
                <input type="text"/>
            </div>
            <div>
                <h5>Role</h5>
                <input type="text"/>
            </div>
            <a href="/">Create Project</a>
        </div>
     );
}
 
export default CreateModal;