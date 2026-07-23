import React from 'react'
import { Link } from 'react-router'

export default function About() {
  return (
    <div>
      <div className='text large thin'>Who We Are</div>
      <p className='text regular paragraph'>The American Federation of Musicians Local 47 is a labor union that serves to promote and protect the concerns of professional musicians in all areas of the music industry. Our offices are located in Burbank, California.</p>
      <p className='text regular paragraph'>Members of AFM Local 47 are high-level studio musicians, signed to major and indie labels, work on major motion pictures and television, tour throughout the world, and are members of premiere orchestras and symphonies including the LA Philharmonic, LA Opera, Pasadena Symphony, Hollywood Bowl Orchestra and more. The more than 5,000 members we represent — arrangers, composers, producers, contractors, engineers, and freelance musicians — are regarded as some of the very best in the world.</p>
      <p className='text regular paragraph'>Formed by and for Los Angeles musicians in 1897, AFM Local 47 members united together to advocate for fair wages and working conditions, oppose the forces of exploitation through solidarity and collective action, and preserve the dignity and respect all professional workers deserve.</p>
      <p className='text regular paragraph'>AFM Local 47 serves musicians working in the counties of Los Angeles (except for that portion which is in the jurisdiction of Local 7 in Orange County), Riverside, San Bernardino and Ventura, as well as Catalina Island. As an affiliate of the 80,000-member <a className='link blue' href='https://afm.org' target="_blank" rel="noopener noreferrer">American Federation of Musicians of the United States and Canada, AFL-CIO</a>, we negotiate with employers to establish fair wages and working conditions, and our officers and staff enforce union contracts to assure professional standards and treatment for musicians.</p>
      <p className='text regular paragraph'>As a proud member of the Los Angeles County Federation of Labor, California Labor Federation, and AFL-CIO, we work alongside our fellow labor unions at home and abroad to champion social and economic justice for all workers.</p>
      <p className='text regular paragraph'></p>
      <p className='text regular paragraph'>Learn more about the benefits of union membership <Link to='/join-L47' className='link blue'>here</Link>.</p>

    </div>
    
  )
}
