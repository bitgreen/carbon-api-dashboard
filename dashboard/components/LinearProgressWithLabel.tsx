import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Box, Grid } from "@mui/material";
import styles from "../styles/Home.module.css";

//Linear progress bar for renewable power
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number; power: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ minWidth: 100 }}>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          textAlign='center'
        >
          <Grid item xs={6}>
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
              textAlign='center'
            >
              <Grid item>
                <Typography variant='body2' className={styles.renewableLabel}>
                  {"Zero carbon"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
              textAlign='center'
            >
              <Grid item>
                <Typography
                  variant='body2'
                  color='primary'
                  className={styles.renewableProgress}
                >{`${Math.round(props.value)}%`}</Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant='body2'
                  color='primary'
                  className={styles.powerProgress}
                >{`${Math.round(
                  ((props.value / 100) * props.power) / 1000
                )} kWh`}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%", mr: 1, justifyContent: "center" }}>
        <LinearProgress
          variant='determinate'
          {...props}
          className={styles.progressBar}
        />
      </Box>
      <Box sx={{ minWidth: 100 }}>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          textAlign='center'
        >
          <Grid item xs={6}>
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
              textAlign='center'
            >
              <Grid item>
                <Typography
                  variant='body2'
                  color='gray'
                  className={styles.renewableProgress}
                >{`${Math.round(100 - props.value)}%`}</Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant='body2'
                  color='gray'
                  className={styles.powerProgress}
                >{`${Math.round(
                  (((100 - props.value) / 100) * props.power) / 1000
                )} kWh`}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
              textAlign='center'
            >
              <Grid item>
                <Typography variant='body2' className={styles.renewableLabel}>
                  {"Fossil fuel power"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default LinearProgressWithLabel;
