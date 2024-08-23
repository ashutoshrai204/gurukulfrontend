import React, { useEffect, useState } from "react";
import "./lecture.css";
import { Form, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPreview(reader.result);
      setVideo(file);
    };
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);
    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPreview("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this Lecture ")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);

        // Reset lecture state if the deleted lecture is the current one
        if (lecture._id === id) {
          setLecture({});
        }

        fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
  const [completed, setCompleted] = useState("");
  const [completedLec, setCompletedLec] = useState("");
  const [lectureLength, setLectureLength] = useState("");
  const [progress, setProgress] = useState([]);

  async function fetchProgress() {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLectureLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.log(error);
    }
  }

  const addProgress = async (id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(data.message);
      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(progress);

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="lecture-page">
            <div className="progress">
              Lecture completed - {completedLec} out of {lectureLength} <br />
              <progress value={completed} max={100}></progress> {completed}%
            </div>
            <div className="left">
              {lecLoading ? (
                <Loading />
              ) : (
                <>
                  {lecture.video ? (
                    <>
                      <video
                        src={`${server}/${lecture.video}`}
                        width={"100%"}
                        controls
                        controlsList="nodownload"
                        disablePictureInPicture
                        autoPlay
                        onEnded={() => addProgress(lecture._id)}
                      ></video>
                      <h1 className="lecture-title">{lecture.title}</h1>
                      <h3 className="lecture-description">
                        {lecture.description}
                      </h3>
                    </>
                  ) : (
                    <h1 className="lecture-title">Please select a Lecture</h1>
                  )}
                </>
              )}
            </div>
            <div className="right">
              {user && user.role === "admin" && (
                <button
                  className="comman-bttn adding"
                  onClick={() => setShow(!show)}
                >
                  {show ? "Close" : "Add Lecture +"}
                </button>
              )}

              {show && (
                <div className="lecture-form">
                  <h2 className="video-form-label">Add Lecture</h2>
                  <form onSubmit={submitHandler}>
                    <label htmlFor="text" className="video-form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <label htmlFor="text" className="video-form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                      type="file"
                      placeholder="choose video"
                      onChange={changeVideoHandler}
                      required
                    />
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        alt=""
                        width={300}
                        controls
                      ></video>
                    )}

                    <button
                      disabled={btnLoading}
                      type="submit"
                      className="comman-btn hey"
                    >
                      {btnLoading ? "Please Wait...." : "Add"}
                    </button>
                  </form>
                </div>
              )}

              {lectures && lectures.length > 0 ? (
                lectures.map((e, i) => (
                  <>
                    <div
                      onClick={() => fetchLecture(e._id)}
                      key={i}
                      className={`lecture-number ${
                        lecture._id === e._id && "active"
                      }`}
                    >
                      {i + 1}. {e.title}{" "}
                      {progress[0] && progress[0].completedLectures.includes(e._id) &&
                        <span style={{background:"white", padding:"2px", borderRadius:"6px", color:"blue"}}><TiTick/></span>}
                    </div>
                    {user && user.role === "admin" && (
                      <button
                        className="comman-btnn delete"
                        onClick={() => deleteHandler(e._id)}
                      >
                        Delete
                      </button>
                    )}
                  </>
                ))
              ) : (
                <p>No Lectures Yet!</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Lecture;
