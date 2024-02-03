interface IRatExterminationLogo {
   color?: string;
   size?: string;
}

export default function RatExterminationLogo(props: IRatExterminationLogo): JSX.Element {
   const { color, size } = props;
   const defaultColor = '#6C32D1';
   const defaultSize = '512px';
   return (
      <svg
         height={size || defaultSize}
         width={size || defaultSize}
         version="1.1"
         id="_x32_"
         xmlns="http://www.w3.org/2000/svg"
         xmlnsXlink="http://www.w3.org/1999/xlink"
         viewBox="0 0 512 512"
         xmlSpace="preserve"
      >
         <style type="text/css">{`.st0{fill:${color || defaultColor};}`}</style>
         <g>
            <path
               className="st0"
               d="M199.971,403.14c5.073,0,2.985-7.14-2.39-7.14c-59.183-0.977-84.47-7.536-79.536-22.566 c2.25-6.832,13.212-15.177,25.742-25.949c4.911-4.221,9.72-10.838,14.206-18.53c24.736,14.625,54.463,17.846,57.919,23.398 c4.426,7.102,12.897,19.345,3.228,30.632c-9.676,11.28-1.611,24.184-1.611,24.184s29.022,0,49.978,0 c20.964,0,17.743,1.61,24.191-3.228c9.118-6.846-9.676-16.125-22.573-16.125s-43.536,0-11.286-32.242 c7.698-7.706,10.029-16.92,11.926-27.405L147.677,206.081c-14.493,17.97-23.67,39.816-23.67,65.64 c0,21.757,8.691,36.831,20.714,47.61c-7.155,12.89-15.942,24.948-26.037,33.86 C91.184,377.456,81.625,403.14,199.971,403.14z"
            />
            <path
               className="st0"
               d="M437.015,74.978C390.765,28.691,326.611-0.008,256,0 C185.382-0.008,121.228,28.691,74.986,74.978 C28.692,121.228-0.014,185.39,0,256c-0.014,70.625,28.692,134.78,74.986,181.022 C121.228,483.308,185.382,512.014,256,512 c70.611,0.014,134.765-28.692,181.015-74.978 C483.309,390.78,512.015,326.625,512,256 C512.015,185.39,483.309,121.228,437.015,74.978z M256,463.625 c-57.412-0.008-109.161-23.199-146.816-60.809 C71.582,365.162,48.39,313.412,48.375,256c0.015-50.589,18.036-96.779,48.058-132.794 l292.368,292.367 C352.787,445.581,306.596,463.618,256,463.625z M420.655,382.404L319.088,280.838 c4.485,1.47,9.493,2.691,15.338,2.986 c14.846,0.765,16.125,20.956,16.125,20.956s3.898,10.456,9.677,0 c5.78-10.463,1.611,11.279,8.059,4.838 c12.897-12.897,3.228-33.868-17.736-38.699 c-20.962-4.838-41.11-34.669-18.536-47.566 c15.14-8.647,78.574-35.662,78.574-35.662 c24.647-20.801,19.25-24.691,16.514-32.934 c-2.683-8.051-47.118-28.11-69.36-29.633 c-0.375-12.588-10.632-22.706-23.316-22.706 c-12.912,0-23.375,10.47-23.375,23.375 c0,4.096,1.14,7.89,2.993,11.235 c-12.206,2.736-26.353,5.323-41.647,6.971 c-22.088,2.382-46.927,9.117-69.897,20.25 l-72.912-72.912 C164.61,64.404,208.346,48.397,256,48.382 c57.412,0.014,109.162,23.191,146.816,60.802 c37.604,37.654,60.795,89.412,60.809,146.816 C463.611,303.654,447.588,347.382,420.655,382.404z"
            />
         </g>
      </svg>
   );
}
