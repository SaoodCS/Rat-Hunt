import Color from '../../../css/colors';

interface IRatLogo {
   color?: string;
   size?: string;
}

export default function RatLogo(props: IRatLogo): JSX.Element {
   const { color, size } = props;
   const defaultColor = Color.darkThm.accent;
   const defaultSize = '512px';
   return (
      <svg
         fill={color || defaultColor}
         height={size || defaultSize}
         width={size || defaultSize}
         version="1.1"
         id="Capa_1"
         xmlns="http://www.w3.org/2000/svg"
         xmlnsXlink="http://www.w3.org/1999/xlink"
         viewBox="0 0 264.725 264.725"
         xmlSpace="preserve"
      >
         <path
            d="M220.195,71.427c-0.589-7.654-9.135-15.619-17.979-16.209c-8.844-0.584-17.398,0.301-12.087,6.483
	c5.308,6.188,7.074,12.091,4.423,11.212c-2.66-0.896-13.267-7.08-45.104-2.066c-4.126,1.17-21.221-12.682-44.513-12.977
	c-23.283-0.295-40.381,6.346-64.85,72.296c-2.356,5.828-18.866,19.386-27.71,25.865C3.536,162.529,0.007,169.787,0,182.763
	c-0.018,18.158,25.934,27.187,81.648,26.889c55.715-0.292,85.195-9.388,85.195-9.388c-62.789,6.773-158.907,10.52-158.907-18.687
	c0-20.641,28.321-28.47,36.281-28.184c7.958,0.3,13.562,12.673,33.307,5.603c3.247-0.295,1.48,4.423-1.18,7.369
	c-2.651,2.942-0.586,6.487,9.73,6.487c10.315,0,41.183,0.295,47.707,0c6.531-0.299,11.839-11.792-9.384-12.68
	c-18.548,0.311,12.023-5.773,15.915-21.813c0.709-3.927,8.84-4.139,15.918-4.119c20.777,0.029,34.485,38.193,38.912,38.338
	c4.416,0.15,17.979,1.621,17.683-4.273c-0.292-5.897-11.491-3.241-13.854-6.487c-2.359-3.234-10.023-15.504-7.366-21.104
	c2.65-5.59,12.674-21.229,24.463-22.988c11.789-1.777,42.451,7.361,47.459,0c5.012-7.372-6.783-11.512-15.918-28.611
	C243.779,80.572,238.768,71.728,220.195,71.427z"
         />
      </svg>
   );
}
