import React, { useEffect, useState } from 'react'
import Heading from '../../components/Heading'
import PropertiesListing from '../../components/PropertiesListing'
import fetchProperties from '../../services/fetchPropeties'
import { toast, ToastContainer } from 'react-toastify'
import { addToFavourite, removeFromFavourite } from '../../services/favouriteProperty'
import { useNavigate } from 'react-router'
const PropertiesSection = () => {


  const [properties, setproperties] = useState([])

  const navigate = useNavigate();
  const [isClicked, setisClicked] = useState(false)

  useEffect(() => {
    async function getProperties() {
      try {
        const reponse = await fetchProperties();
        const data = reponse.data;
        console.log(data.properties)
        setproperties(data.properties);
      }
      catch {
        console.log(error.reponse.data)
      }
    }

    getProperties();
  }, [])


  async function addFavourite(propertyId) {
    try {

      if(isClicked){
        return;
      }
      const response = await addToFavourite(propertyId)
      toast.success(response.data.message)
      setproperties(prev => prev.map(
        property =>
          property._id === propertyId
            ? { ...property, isFavourite: true }
            : property
      ))
    } catch (error) {
      setisClicked(false)
      if (error.response.status === 401) {
        navigate('/login')
      }
      else {
        toast.error(error.response.data.message)
      }
    }
  }

  async function removeFavourite(propertyId) {
    try {
      if(isClicked){
        return
      }
      console.log(propertyId)
      setproperties(prev => prev.map(
        property =>
          property._id === propertyId
            ? { ...property, isFavourite: false }
            : property
      ))
      const response = await removeFromFavourite(propertyId)
      toast.success(response.data.message)
    } catch (error) {
      setisClicked(false)
      if (error.response.status === 401) {
        navigate('/login')
      } else {
        toast.error(error.reponse.data.message)
      }
    }
  }
  return (
    <section className=''
      id='properties'
    >
      <div className='content !py-14 space-y-14'>
        <Heading primaryText={"Properties"} secondaryText={"Listing"} para={"Explore the newest listing as your liking."} />

        <PropertiesListing
          properties={properties}
          addFavoriteHandler={addFavourite}
          removeFavoriteHandler={removeFavourite}
          emptyText={"Looks like there is no properties at the moment."}
          setIsClicked={setisClicked}
        />
      </div>

      <ToastContainer />
    </section >
  )
}

export default PropertiesSection