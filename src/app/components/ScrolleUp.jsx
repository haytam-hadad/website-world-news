
export default function ScrolleUp() {
  return (
    <div onClick={() => window.scrollTo({top: 0, left: 0, behavior: 'smooth'})} id="scrolle"><i className="fa-solid fa-arrow-up"></i></div>
  )
}
